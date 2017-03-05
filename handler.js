'use strict';

const orchestration = require('./lib/controller/orchestration');
const moment = require('moment');

function timeRemaining(context) {
  return 0.75 * context.getRemainingTimeInMillis();
}

function collectAll(event, context, callback) {
  const year = event.year || moment().year();
  orchestration.collectAll(year, timeRemaining(context)).asCallback(callback);
}

module.exports = {
  collectAll
};
