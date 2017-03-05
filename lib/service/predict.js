'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

const invoke = Promise.promisify(lambda.invoke);

function initiate(year) {
  const params = {
    FunctionName: process.env.PREDICT_LAMBDA_ARN,
    InvocationType: "Event",
    Payload: JSON.stringify({year})
  };

  return invoke(params)
    .then((data) => console.log("Prediction initiated with response", data));
}

module.exports = {
  initiate
};
