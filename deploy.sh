npm prune --production

./decrypt.sh
# source config/env.sh
SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=dev --region=ap-southeast-2 --verbose
