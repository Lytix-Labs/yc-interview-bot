import json
import os
from fastapi.responses import JSONResponse
from openai import OpenAI
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from pinecone import Pinecone

from optimodel import queryModel
from optimodel_server_types import ModelTypes, ModelMessage

import sys
import logging


PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_PG_INDEX = os.environ.get("PINECONE_PG_INDEX")

pc = Pinecone(api_key=PINECONE_API_KEY)
pgEssaysIndex = pc.Index(PINECONE_PG_INDEX)

openAiClient = OpenAI(api_key=os.environ.get("OPEN_AI_KEY"))


logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

baseURL = "/api/v1"

dir_path = os.path.dirname(os.path.realpath(__file__))
with open(f"{dir_path}/pg-essays.json") as f:
    pgEssay = json.load(f)


class UploadFileBody(BaseModel):
    fileData: bytes


def validator(x) -> bool:
    """
    Simple validator to check if the response is JSON
    """
    try:
        json.loads(x)
        return True
    except:
        return False


@app.post(f"{baseURL}/uploadFile")
async def upload(file: UploadFile = None):
    try:
        if file is None:
            responseFormatted = """Spare Change is a fintech startup that helps customers donate to their favorite charities with every transaction. The company was founded by Sahil Sinha and Sidhartha Premkumar, who met in high school and have experience in fintech. They aim to make donating to charity seamless and fun, like buying stocks or paying friends.

The founders have a live beta version of the app, which has processed $10 in donations from 5 users. They plan to monetize the app through transaction fees, voluntary tips, and selling ad space to socially conscious businesses.

The company's competitors include other round-up apps, philanthropic arms of big tech companies, and social-impact dedicated fintech startups. Spare Change differentiates itself by offering flexibility in donation amounts, charity vetting, and a wider acquisition funnel.

The founders plan to split equity evenly between themselves and have not formed a legal entity yet. They have not raised any funding and are not currently fundraising."""
        else:
            full_pdf = PdfReader(file.file)

            extracted_text = ""
            for page in full_pdf.pages:
                extracted_text += page.extract_text()

            # Lets summarize the application first
            prompt = f"Given this application to a startup accelerator. Please summarize it in less than 500 words for me with no other text: {extracted_text}"
            response = await queryModel(
                model=ModelTypes.llama_3_8b_instruct,
                messages=[
                    ModelMessage(
                        role="system",
                        content="You are a helpful assistant",
                    ),
                    ModelMessage(role="user", content=prompt),
                ],
                temperature=0,
            )

            responseFormatted = response.replace(
                "Here is a summary of the application in under 500 words:", ""
            )

        # Okay now we need to embed the summary, and find similar essays
        embeddedResults = openAiClient.embeddings.create(
            input=responseFormatted, model="text-embedding-3-small"
        )
        queryEmbedding = embeddedResults.data[0].embedding

        # Now search pinecone for essays that might be relevant
        matchingVectors = pgEssaysIndex.query(
            top_k=3,
            vector=queryEmbedding,
        )

        allMatchingIndexes = [x["id"] for x in matchingVectors.matches]
        allMatchingEssays = []
        for index in allMatchingIndexes:
            # Get the actual context from our json
            content = pgEssay[int(index)]
            allMatchingEssays.append(content)

        # Now lets reverse search the essays to get the raw text
        paulGramEssays = "\n".join(allMatchingEssays)

        # And we're ready to start building questions now
        finalPrompt = f"Given a summary of an application to a startup accelerator, please come up with a list of questions to ask the applicant to answer. Here is the summary: {responseFormatted}. You should ask the questions in the format of Paul Gram, here are some examples of how he speaks: {paulGramEssays}. Only return JSON list of questions."
        response = await queryModel(
            model=ModelTypes.llama_3_8b_instruct,
            messages=[
                ModelMessage(
                    role="system",
                    content="You are a startup accelerator. You are given a summary of an application to a startup accelerator. You are tasked with coming up with a list of questions to ask the applicant to answer. Only return a JSON array of strings, each string being a question.",
                ),
                ModelMessage(role="user", content=finalPrompt),
            ],
            validator=validator,
            fallbackModels=[ModelTypes.llama_3_70b_instruct],
            temperature=0,
            maxGenLen=2000,
        )

        # Awesome, now lets return this to the user
        return {"questions": json.loads(response)}
    except Exception:
        logger.error(
            f"Error uploading file: {file is None} {file.filename if file is not None else ''}",
            exc_info=True,
        )
        return JSONResponse(
            status_code=400,
            content={"message": "There was an error uploading the file"},
        )
    finally:
        if file is not None:
            file.file.close()


@app.get("/health")
async def health():
    return {"success": True}
