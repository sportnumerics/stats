#!/bin/bash

set -e

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

aws --version

if [ "$LAMBCI_BRANCH" = "master" ] && [ -z "$LAMBCI_PULL_REQUEST"]; then
  ACTIVE_DEPLOYMENT=$(./node_modules/.bin/explorer-cdn describe-active-stage)
  if [ "$ACTIVE_DEPLOYMENT" = "prodgreen" ]; then
    STAGE="prodblue"
  else
    STAGE="prodgreen"
  fi
else
  STAGE=dev
fi

IMAGE_NAME="sportnumerics-stats-$STAGE"

docker --version
eval $(aws ecr get-login)
docker build -t $IMAGE_NAME .

STACK_NAME="sportnumerics-stats-$STAGE"

aws cloudformation deploy \
  --stack-name=$STACK_NAME \
  --template-file cloudformation.yml \
  --parameter-overrides Stage=$STAGE \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset

docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
