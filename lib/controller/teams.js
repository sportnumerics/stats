'use strict';

const service = require('../service/teams');
const adapter = require('../adapter/teams-html-to-json');
const config = require('config');
const persistence = require('../service/persistence');
const normalizeTeam = require('../adapter/normalize-team');

function collect(year, division) {
  let teamProps = {
    year,
    div: division.id,
    sport: division.sport
  }
  return service.getHtmlFromNcaa(year, division)
    .then(adapter(teamProps));
}

function normalize({ year, divs, teams }) {
  let normalizedTeams = teams.map(normalizeTeam(teams, divs));
  return Promise.map(normalizedTeams, team => {
    let id = team.id;
    console.log(`Updating team ${team.id} (${year}) with normalized schedule`);
    return persistence.set(config.ResultsTable, { id, year }, team);
  })
  .then((results) => {
    let count = results.length;
    console.log(`Successfully normalized ${count} teams.`);
    return { count };
  });
}

module.exports = {
  collect,
  normalize
};
