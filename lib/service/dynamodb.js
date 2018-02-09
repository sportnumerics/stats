'use strict';

global.Promise = require('bluebird');
const { DynamoDBEndpoint } = require('config');
const AWS = require('aws-sdk');

const service = new AWS.DynamoDB({ endpoint: DynamoDBEndpoint });
const db = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient({ service }));

module.exports = db;
