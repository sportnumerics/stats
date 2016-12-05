'use strict';

let cheerio = require('cheerio'),
  elementMatchers = require('./element-matchers');

module.exports = function teamsHtmlToJson(html) {
  var $ = cheerio.load(html);

  return $('td a').map((index, elem) => {
    return elementMatchers.extractTeamFromElement($(elem));
  }).get();
}
