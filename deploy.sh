npm prune --production

./decrypt.sh
source config/env.sh
./install_aws_cli.sh
/tmp/lambci/home/bin/aws cloudformation list-stacks --region ap-southeast-2

SLS_DEBUG=* \
node_modules/.bin/serverless deploy --stage=dev --verbose
