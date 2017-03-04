'use strict';

const messaging = require('../service/messaging');
const divisions = require('./divisions');
const teams = require('./teams');

function triggerScheduleCollection(teams, year, totalTime) {
  let interval = totalTime / teams.length;
  return Promise.map(teams, (team, i) => {
    return Promise.delay(i*interval, team.id)
      .then((teamId) => {
        console.log(`Publishing collect schedule message for team id ${teamId}`);
        return messaging.publishCollectSchedule(year, teamId);
      });
  });
}

function collectTeamsAndSchedules(year, division, totalTime) {
  return teams.collect(year, division)
    .then((teams) => triggerScheduleCollection(teams, year, totalTime));
}

function collectAll(year) {
  return divisions.collect(year).then((divs) => {
    return Promise.map(divs, (div) => {
      return messaging.publishCollectTeams(year, div.id);
    });
  });
}

module.exports = {
  collectTeamsAndSchedules,
  collectAll
};
