'use strict';

const messaging = require('./lib/service/messaging');
const orchestration = require('./lib/controller/orchestration');
const schedule = require('./lib/controller/schedule');
const AWS = require('aws');

const lambda = AWS.Lambda();

function initiate(event, context, callback) {
  messaging.publishCollectTeams('2016', '1').asCallback(callback);
}

function collect(event, context, callback) {
  let payload = messaging.snsEventToJson(event);
  let route = payload.route;
  switch (route) {
    case "teams":
      orchestration.collectTeamsAndSchedules(payload.year, payload.div)
        .asCallback(callback);
      break;
    case "schedule":
      schedule.collect(payload.id)
        .asCallback(callback);
      break;
    default:
      callback(new Error("Unknown route."));
  }
}

module.exports = {
  initiate,
  collect
};
