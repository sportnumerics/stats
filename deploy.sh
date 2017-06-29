#!/bin/bash

set -e

npm prune --production

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

if [ "$LAMBCI_BRANCH" = "master" ] && [ -z "$LAMBCI_PULL_REQUEST"]; then
  pip install --user awscli
  CDN_STACK_NAME="sportnumerics-explorer-cdn-prod"
  ACTIVE_DEPLOYMENT=$(aws cloudformation describe-stacks --stack-name $CDN_STACK_NAME --query 'Stacks[0].Outputs[?OutputKey==`ExplorerStageDeployment`].OutputValue' --output text)
  if [ "$ACTIVE_DEPLOYMENT" = "prodgreen" ]; then
    STAGE="prodblue"
  else
    STAGE="prodgreen"
  fi
else
  STAGE=dev
fi

SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=$STAGE --verbose
