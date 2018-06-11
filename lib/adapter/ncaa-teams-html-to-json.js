'use strict';

const cheerio = require('cheerio');
const elementMatchers = require('./element-matchers');
const utils = require('./utils');

module.exports = (teamProps) => (html) => {
  var $ = cheerio.load(html);

  return $('td a').map((index, elem) => {
    let team = Object.assign({}, elementMatchers.extractTeamFromElement($(elem)), teamProps);
    return utils.addTeamId(team);
  }).get();
}
