'use strict';

const adapter = require('../adapter/schedule-html-to-json');
const persistence = require('../service/persistence');
const service = require('../service/schedule');

function collect(teamId) {
  return service.getHtmlFromNcaa(teamId)
    .then(adapter)
    .then(schedule => {
      return persistence.write(`teams/${teamId}/schedule`, {schedule})
      .then(() => schedule);
    });
};

module.exports = {
  collect
};
