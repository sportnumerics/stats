npm install -g serverless

npm prune --production

source config/env.sh
serverless deploy --verbose
