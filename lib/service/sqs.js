'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');

const sqs = Promise.promisifyAll(new AWS.SQS());

module.exports = sqs;