#!/bin/bash

set -e

docker buildx build --platform linux/amd64 -t yc-charbot-frontend-prod .
docker tag yc-charbot-frontend-prod:latest ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/yc-charbot-frontend-prod:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/yc-charbot-frontend-prod:latest