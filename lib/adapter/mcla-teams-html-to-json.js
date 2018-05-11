'use strict';

const cheerio = require('cheerio');
const elementMatchers = require('./element-matchers');
const utils = require('./utils');

module.exports = (teamProps) => (html) => {
  const $ = cheerio.load(html);

  const divisionalTables = $('.team-roster');

  const divisionOffset = Number(teamProps.source.id) - 1;

  const divisionTable = divisionalTables.eq(divisionOffset);

  const teams = divisionTable.find('tr')

  return teams.map((index, elem) => {
    const nameLink = $(elem).find('a').eq(0);
    const name = nameLink.text().trim();
    const slug = nameLink.attr('href').match(/\/team\/([^\/]+)\/(\d+)\/schedule.html/)[1];
    const instCode = sanitizeSlug(slug)
    const team = {
      name,
      instCode,
      ...teamProps
    };
    return addTeamId(team);
  }).get();
}

function addTeamId(team) {
  return Object.assign({}, team, { id: utils.sportAndInstCodeToId(team.sport, team.instCode)});
}

function sanitizeSlug(slug) {
  return slug.replace('_', '-');
}