'use strict';

const adapter = require('../adapter/schedule-html-to-json');
const persistence = require('../service/persistence');
const service = require('../service/schedule');

function collect(year, teamId) {
  return service.getHtmlFromNcaa(year, teamId)
    .then(adapter)
    .then(schedule => {
      console.log(`Persisting schedule for team id ${teamId}`);
      return persistence.write(`years/${year}/teams/${teamId}/schedule`, {schedule})
      .then(() => schedule);
    });
};

module.exports = {
  collect
};
