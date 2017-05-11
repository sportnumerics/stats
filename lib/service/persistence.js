'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');
const config = require('config');
const _ = require('lodash');

const S3 = new AWS.S3();

function write(filename, contents) {
  return new Promise((resolve, reject) => {
    const params = Object.assign(config.S3ObjectParams, {
      "Bucket": process.env.RESULTS_BUCKET,
      "Key": filename,
      "Body": JSON.stringify(contents)
    });

    S3.putObject(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    })
  });
}

const db = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());

function set(table, key, object) {
  let i = 0;
  let interpolations = _.map(object, (value, key) => {
    let attribute = `:p${i++}`;
    return {
      attribute,
      expression: `${key} = ${attribute}`,
      value
    };
  });
  let updateExpression = `set ${_.map(interpolations, 'expression').join(', ')}`;
  let params = {
    TableName: table,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: _.zipObject(_.map(interpolations, 'attribute'), _.map(interpolations, 'value'))
  };
  return db.updateAsync(params)
}

module.exports = {
  set
};
