'use strict';

const service = require('../service/teams');
const persistence = require('../service/persistence');
const adapter = require('../adapter/teams-html-to-json');
const messaging = require('../service/messaging');

function persist(teams, division) {
  console.log(`Persisting teams list for division ${division}`);
  return persistence.write(`divs/${division}/teams`, {teams})
    .then(() => teams);
}

function collect(year, division) {
  return service.getHtmlFromNcaa(year, division)
    .then(adapter)
    .then((teams) => persist(teams, division));
}

module.exports = {
  collect
};
