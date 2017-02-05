'use strict';

const messaging = require('../service/messaging');
const teams = require('./teams');

const TOTAL_TIME = 150000;

function collectSchedules(teams, totalTime = TOTAL_TIME) {
  let interval = totalTime / teams.length;
  return Promise.map(teams, (team, i) => {
    return Promise.delay(i*interval, team.id)
      .then((teamId) => {
        console.log(`Publishing collect schedule message for team id ${teamId}`);
        return messaging.publishCollectSchedule(teamId);
      });
  });
}

function collectTeamsAndSchedules(year, division) {
  return teams.collect(year, division)
    .then(collectSchedules);
}

module.exports = {
  collectTeamsAndSchedules
};
