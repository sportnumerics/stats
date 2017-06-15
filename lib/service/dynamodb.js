'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');

const db = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());

module.exports = db;