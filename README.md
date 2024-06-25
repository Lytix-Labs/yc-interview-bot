# YC Interview Bot

We've built this to help folks navigate the YC interview process. Check out our blog post [here](https://blog.lytix.co/posts/yc-interviewer-bot) to learn more.

## Live

Check out this project [here](https://yc-bot.lytix.co/).

## Running locally

This mostly relies on having a pinecone database with [this](https://github.com/mckaywrigley/paul-graham-gpt?tab=readme-ov-file) data. Once you have that, note the index and you can run the backend with the following:

```sh
> cd app
> pip3 install fastapi python-multipart pypdf optimodel-py pinecone openai
> LX_API_KEY="123" PINECONE_API_KEY="123" OPEN_AI_KEY="123" PINECONE_PG_INDEX="index-name" fastapi dev app.py --port 8001
```

And then you can start the frontend by

```sh
> npm install
> NEXT_PUBLIC_API_URL=http://localhost:8001 npm run start
```
