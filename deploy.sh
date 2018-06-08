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
eval $(aws ecr get-login --no-include-email)
docker build -t $IMAGE_NAME .

STACK_NAME="sportnumerics-stats-$STAGE"

DEPLOYMENT_BUCKET=$(
  aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' \
    --output text
  )

if [ -z "$DEPLOYMENT_BUCKET" ]; then
  TEMPORARY_BUCKET_NAME="temporary-sportnumerics-stats-deployment-bucket"
  aws s3 mb "s3://$TEMPORARY_BUCKET_NAME" --region $AWS_DEFAULT_REGION
  DEPLOYMENT_BUCKET=$TEMPORARY_BUCKET_NAME
fi

mkdir -p build

aws cloudformation package \
  --template-file cloudformation-update.yml \
  --s3-bucket $DEPLOYMENT_BUCKET \
  --output-template-file build/cf.yml

aws cloudformation deploy \
  --stack-name=$STACK_NAME \
  --template-file build/cf.yml \
  --parameter-overrides Stage=$STAGE \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset

docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_NAME:latest

if [ ! -z "$TEMPORARY_BUCKET_NAME" ]; then
  aws s3 rm --recursive "s3://$TEMPORARY_BUCKET_NAME"
  aws s3 rb "s3://$TEMPORARY_BUCKET_NAME"
fi