npm prune --production

./decrypt.sh
source config/env.sh
node_modules/.bin/serverless deploy --verbose
