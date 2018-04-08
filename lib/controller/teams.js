'use strict';

const service = require('../service/teams');
const ncaaAdapter = require('../adapter/ncaa-teams-html-to-json');
const mclaAdapter = require('../adapter/mcla-teams-html-to-json')
const config = require('config');
const persistence = require('../service/persistence');
const normalizeTeam = require('../adapter/normalize-team');

const sourceMapping = {
  'ncaa': () => service.getHtmlFromNcaa,
  'mcla': () => service.getHtmlFromMcla
};

const adapterMapping = {
  'ncaa': () => ncaaAdapter,
  'mcla': () => mclaAdapter
};

async function collect(year, division) {
  let teamProps = {
    year,
    div: division.id,
    sport: division.sport,
    source: division.source
  }

  const source = sourceMapping[division.source.type]();
  const adapter = adapterMapping[division.source.type]();

  const teams = await source(year, division);

  console.log(`Got ${teams.length} teams`);

  return adapter(teamProps)(teams);
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
