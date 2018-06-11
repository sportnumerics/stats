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
    const instCode = nameLink.attr('href').match(/\/team\/([^\/]+)\/(\d+)\/schedule.html/)[1];
    const team = {
      name,
      instCode,
      ...teamProps
    };
    return utils.addTeamId(team);
  }).get();
}