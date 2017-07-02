'use strict';

let cheerio = require('cheerio'),
  elementMatchers = require('./element-matchers');

module.exports = (div) => (html) => {
  var $ = cheerio.load(html);

  return $('td a').map((index, elem) => {
    return Object.assign({}, elementMatchers.extractTeamFromElement($(elem)), { div });
  }).get();
}
