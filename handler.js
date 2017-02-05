'use strict';

const messaging = require('./lib/service/messaging');
const orchestration = require('./lib/controller/orchestration');
const schedule = require('./lib/controller/schedule');
const AWS = require('aws');

const lambda = AWS.Lambda();

function timeRemaining(context) {
  return 0.75 * context.getRemainingTimeInMillis();
}

function initiate(event, context, callback) {
  orchestration.collectAll('2016').asCallback(callback);
}

function collect(event, context, callback) {
  let payload = messaging.snsEventToJson(event);
  let route = payload.route;
  switch (route) {
    case "teams":
      orchestration.collectTeamsAndSchedules(payload.year, payload.div, timeRemaining(context))
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
