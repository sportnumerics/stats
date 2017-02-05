npm prune --production

./decrypt.sh
source config/env.sh
aws cloudformation describe-stacks --region ap-southeast-2 --stack-name sportnumerics-dev
SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=dev --verbose
