FROM node:alpine
WORKDIR /app
ADD . .
RUN yarn
CMD node index.js
