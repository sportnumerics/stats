global.Promise = require('bluebird');
const AWS = require('aws-sdk');

const S3 = Promise.promisifyAll(new AWS.S3());

module.exports = S3;