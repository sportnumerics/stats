npm prune --production

./decrypt.sh
source ./config/env.sh
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_SESSION_TOKEN
./install_aws_cli.sh
/tmp/lambci/home/bin/aws cloudformation list-stacks --region ap-southeast-2

SLS_DEBUG=* node_modules/.bin/serverless deploy --stage=dev --verbose
