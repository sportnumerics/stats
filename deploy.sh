npm prune --production

./decrypt.sh
source config/env.sh
SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=dev --verbose
