const moment = require('moment');

function shouldRefreshStatsGivenMoment(moment) {
  return moment.month() < 5;
}

function shouldRefreshStats() {
  return shouldRefreshStatsGivenMoment(moment());
}

module.exports = {
  shouldRefreshStatsGivenMoment,
  shouldRefreshStats
};