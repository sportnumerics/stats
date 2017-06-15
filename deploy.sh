set -e

npm prune --production

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

if [ "$LAMBCI_BRANCH" = "master" ]; then
  pip install --user awscli
  STACK_PREFIX="sportnumerics-stats"
  STAGE="prodgreen"
  if aws cloudformation describe-stacks --stack-name "$STACK_PREFIX-$STAGE"; then
    STAGE="prodblue"
  fi
else
  STAGE=dev
fi

SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=$STAGE --verbose
