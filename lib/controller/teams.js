'use strict';

const service = require('../service/teams');
const adapter = require('../adapter/teams-html-to-json');
const messaging = require('../service/messaging');

function collect(year, division) {
  let teamProps = {
    year,
    div: division.id
  }
  return service.getHtmlFromNcaa(year, division)
    .then(adapter(teamProps));
}

module.exports = {
  collect
};
