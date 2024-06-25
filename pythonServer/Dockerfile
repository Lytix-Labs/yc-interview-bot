FROM python:3.12-slim

RUN pip3 install fastapi python-multipart pypdf optimodel-py pinecone openai

COPY . .

CMD [ "executable" ]