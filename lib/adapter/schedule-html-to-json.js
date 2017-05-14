'use strict';

let cheerio = require('cheerio'),
  elementMatchers = require('./element-matchers'),
  moment = require('moment'),
  utils = require('./utils');

module.exports = function scheduleHtmlToJson(html, teamList) {
  var $ = cheerio.load(html);

  return $('.mytable').first().find('tr').has('.smtext').map((index, row) => {
    var cols = $(row).children();
    var game = elementMatchers.extractGameFromElement(cols.eq(1));
    game.opponent = utils.getOpponentIdFromTeamList(game.opponent, teamList);
    game.date = moment.utc(cols.eq(0).text(), 'MM/DD/YYYY').toISOString();
    let result = elementMatchers.extractResultFromElement(cols.eq(2));
    if (typeof result !== 'undefined') {
      game.result = result;
    }
    return game;
  }).get();
}
