'use strict';

const orchestration = require('./lib/controller/orchestration');
const moment = require('moment');

function timeRemaining(context) {
  return 0.5 * context.getRemainingTimeInMillis();
}

function collectAllTeamsForReduction(event, context, callback) {
  const year = event.year || `${moment().year()}`;
  orchestration.collectAllTeamsForReduction(year).asCallback(callback);
}

function reduceTeams(event, context, callback) {
  orchestration.reduceTeams().asCallback(callback);
}

function onTeamsModified(event, context, callback) {
  orchestration.onTeamsModified(event).asCallback(callback);
}

module.exports = {
  collectAllTeamsForReduction,
  reduceTeams,
  onTeamsModified
};
