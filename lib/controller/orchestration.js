'use strict';

const predict = require('../service/predict');
const divisions = require('./divisions');
const teams = require('./teams');
const schedule = require('./schedule');

function triggerScheduleCollection(teams, division, year, totalTime) {
  let interval = totalTime / teams.length;
  return Promise.map(teams, (team, i) => {
    return Promise.delay(i*interval, team.id)
      .then((teamId) => {
        return schedule.collect(year, division, teamId, teams);
      });
  });
}

function collectTeamsAndSchedules(year, division, totalTime) {
  return teams.collect(year, division)
    .then((teams) => triggerScheduleCollection(teams, division, year, totalTime));
}

function collectAll(year, totalTime) {
  return divisions.collect(year).then((divs) => {
    return Promise.map(divs, (div) => {
      return collectTeamsAndSchedules(year, div.id, totalTime);
    });
  }).then(() => {
    return predict.initiate(year);
  });
}

module.exports = {
  collectAll
};
