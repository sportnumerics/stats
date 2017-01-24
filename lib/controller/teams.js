'use strict';

const service = require('../service/teams');
const persistence = require('../service/persistence');
const adapter = require('../adapter/teams-html-to-json');

function collect(year, division) {
  return service.getHtmlFromNcaa(year, division)
  .then(adapter)
  .then(teams => {
    return persistence.write(`divs/${division}/teams`, {teams})
    .then(() => teams);
  });
}

module.exports = {
  collect
};
