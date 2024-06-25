#!/bin/bash

set -e

docker buildx build --platform linux/amd64 -t yc-charbot-frontend-prod .
docker tag yc-charbot-frontend-prod:latest 847514765596.dkr.ecr.us-east-1.amazonaws.com/yc-charbot-frontend-prod:latest
docker push 847514765596.dkr.ecr.us-east-1.amazonaws.com/yc-charbot-frontend-prod:latest