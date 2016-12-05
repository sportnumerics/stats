npm prune --production

source config/env.sh
node_modules/.bin/serverless deploy --verbose
