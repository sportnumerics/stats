'use strict';

const orchestration = require('./lib/controller/orchestration');
const moment = require('moment');

function timeRemaining(context) {
  return 0.5 * context.getRemainingTimeInMillis();
}

function collectAllTeamsForReduction(event, context, callback) {
  const year = event.year || thisYear();
  orchestration.collectAllTeamsForReduction(year).asCallback(callback);
}

function reduceTeams(event, context, callback) {
  orchestration.reduceTeams().asCallback(callback);
}

function normalizeTeams(event, context, callback) {
  const year = event.year || thisYear();
  orchestration.normalizeTeams(year).asCallback(callback);
}

function thisYear() {
  return `${moment().year()}`;
}

module.exports = {
  collectAllTeamsForReduction,
  reduceTeams,
  normalizeTeams
};
