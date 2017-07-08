'use strict';

const cheerio = require('cheerio');
const elementMatchers = require('./element-matchers');
const utils = require('./utils');

module.exports = (teamProps) => (html) => {
  var $ = cheerio.load(html);

  return $('td a').map((index, elem) => {
    let team = Object.assign({}, elementMatchers.extractTeamFromElement($(elem)), teamProps);
    return addTeamId(team);
  }).get();
}

function addTeamId(team) {
  let sport = team.sport;
  let inst = team.instCode;
  return Object.assign({}, team, { id: utils.sportAndInstCodeToId(sport, inst)});
}