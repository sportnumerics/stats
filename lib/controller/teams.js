'use strict';

const service = require('../service/teams');
const adapter = require('../adapter/teams-html-to-json');
const messaging = require('../service/messaging');
const config = require('config');
const persistence = require('../service/persistence');
const normalizeTeam = require('../adapter/normalize-team');

function collect(year, division) {
  let teamProps = {
    year,
    div: division.id
  }
  return service.getHtmlFromNcaa(year, division)
    .then(adapter(teamProps));
}

function normalize(year) {
  return Promise.props({
    divs: persistence.get(config.DivisionsTable, { year }),
    teams: persistence.get(config.ResultsTable, { year }, { index: 'schedule' })
  }).then(({divs, teams}) => {
    let normalizedTeams = teams.map(normalizeTeam(teams, divs))
    return Promise.map(normalizedTeams, team => {
      let id = team.id;
      return persistence.set(config.ResultsTable, { id, year }, team);
    });
  });
}

module.exports = {
  collect,
  normalize
};
