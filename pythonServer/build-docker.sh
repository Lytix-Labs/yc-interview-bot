#!/bin/bash

set -e

docker buildx build --platform linux/amd64 -t yc-bot-backend .
docker tag yc-bot-backend:latest 847514765596.dkr.ecr.us-east-1.amazonaws.com/yc-bot-backend-prod:latest
docker push 847514765596.dkr.ecr.us-east-1.amazonaws.com/yc-bot-backend-prod:latest