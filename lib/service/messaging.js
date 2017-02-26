'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');
const config = require('config');

const sns = new AWS.SNS();

function snsEventToJson(sns) {
  return JSON.parse(sns.Records[0].Sns.Message);
}

function jsonToSnsParams(jsonObject) {
  return {
    Message: JSON.stringify(jsonObject)
  };
}

function publish(params) {
  params.TargetArn = process.env.SNS_TOPIC;
  return new Promise((resolve, reject) => {
    sns.publish(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

function publishCollectTeams(year, div) {
  return publish(jsonToSnsParams({'route':'teams', 'year': year, 'div': div}));
}

function publishCollectSchedule(year, teamId) {
  return publish(jsonToSnsParams({'route':'schedule', 'year': year, 'id': teamId}));
}

function publishPredict(division) {
  return publish(jsonToSnsParams({'route':'predict', 'div': division}));
}

module.exports = {
  snsEventToJson,
  jsonToSnsParams,
  publish,
  publishCollectTeams,
  publishCollectSchedule,
  publishPredict
};
