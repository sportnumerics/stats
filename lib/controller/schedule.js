'use strict';

const scheduleHtmlToJson = require('../adapter/schedule-html-to-json');
const persistence = require('../service/persistence');
const service = require('../service/schedule');

function collect(year, teamId, teamList) {
  return service.getHtmlFromNcaa(year, teamId)
    .then(gameHtml => {
      return scheduleHtmlToJson(gameHtml, teamList);
    }).then(schedule => {
      console.log(`Persisting schedule for team id ${teamId}`);
      return persistence.write(`years/${year}/teams/${teamId}/schedule`, {schedule})
      .then(() => schedule);
    });
};

module.exports = {
  collect
};
