'use strict';

const messaging = require('../service/messaging');
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
  const divs = ['1', '2', '3'];

  return Promise.map(divs, (div) => {
    return messaging.publishCollectTeams(year, div);
  });
}

module.exports = {
  collectTeamsAndSchedules,
  collectAll
};
