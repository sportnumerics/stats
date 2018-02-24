#!/bin/bash

set -e

npm prune --production

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

pip install awscli --upgrade --user
aws --version

if [ "$LAMBCI_BRANCH" = "master" ] && [ -z "$LAMBCI_PULL_REQUEST"]; then
  CDN_STACK_REGION="ap-southeast-2"
  CDN_STACK_NAME="sportnumerics-explorer-cdn-prod"
  ACTIVE_DEPLOYMENT=$(aws --region $CDN_STACK_REGION cloudformation describe-stacks --stack-name $CDN_STACK_NAME --query 'Stacks[0].Outputs[?OutputKey==`ExplorerStageDeployment`].OutputValue' --output text)
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
  --capabilities CAPABILITY_IAM

docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
