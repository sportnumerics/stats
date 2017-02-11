set -e

npm prune --production

./decrypt.sh
source ./config/env.sh
unset AWS_SESSION_TOKEN

SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=dev --verbose
