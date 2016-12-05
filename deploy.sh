npm install -g serverless

rm -rf node_modules
npm install --production

source config/env.sh
serverless --verbose deploy
