set -e

npm prune --production

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

if [ "$LAMDBCI_BRANCH" = "master" ]; then
  STAGE=prod
else
  STAGE=dev
fi

SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=$STAGE --verbose
