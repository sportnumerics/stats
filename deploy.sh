npm prune --production

./decrypt.sh
source config/env.sh
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
AWS_PROFILE=serverless \
SLS_DEBUG=* \
node_modules/.bin/serverless deploy --stage=dev --verbose
