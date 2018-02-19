'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');

function initiate(year, lambda) {
  lambda = lambda || new AWS.Lambda();

  const params = {
    FunctionName: process.env.PREDICT_LAMBDA_ARN,
    InvocationType: "Event",
    Payload: JSON.stringify({year})
  };

  return new Promise((resolve, reject) => {
    console.log(`Triggering prediction calculations for ${year}`);
    lambda.invoke(params, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = {
  initiate
};
