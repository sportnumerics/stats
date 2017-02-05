'use strict';

const adapter = require('../adapter/schedule-html-to-json');
const persistence = require('../service/persistence');
const service = require('../service/schedule');

function collect(teamId) {
  return service.getHtmlFromNcaa(teamId)
    .then(adapter)
    .then(schedule => {
      console.log(`Persisting schedule for team id ${teamId}`);
      console.log(JSON.stringify({schedule}));
      return persistence.write(`teams/${teamId}/schedule`, {schedule})
      .then(() => schedule);
    });
};

module.exports = {
  collect
};
