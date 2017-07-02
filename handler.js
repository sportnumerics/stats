'use strict';

const orchestration = require('./lib/controller/orchestration');
const moment = require('moment');

function timeRemaining(context) {
  return 0.5 * context.getRemainingTimeInMillis();
}

function collectAllForTeamsReduction(event, context, callback) {
  const year = event.year || `${moment().year()}`;
  orchestration.collectAllTeamsForReduction(year).asCallback(callback);
}

function reduceOneTeam(event, context, callback) {
  orchestration.reduceOneTeam(event).asCallback(callback);
}

module.exports = {
  collectAllForTeamsReduction,
  reduceOneTeam
};
