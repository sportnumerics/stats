'use strict';

let cheerio = require('cheerio'),
  elementMatchers = require('./element-matchers');

module.exports = (teamProps) => (html) => {
  var $ = cheerio.load(html);

  return $('td a').map((index, elem) => {
    return Object.assign({}, elementMatchers.extractTeamFromElement($(elem)), teamProps);
  }).get();
}
