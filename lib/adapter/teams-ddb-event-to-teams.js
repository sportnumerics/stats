'use strict';

const AWS = require('aws-sdk');

module.exports = function teamsDdbEventToTeams(event) {
  return event.Records.map(record => {
    return AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
  });
}