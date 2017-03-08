'use strict';

let cheerio = require('cheerio'),
  elementMatchers = require('./element-matchers'),
  moment = require('moment'),
  _ = require('lodash'),
  farmhash = require('farmhash');

function generateOpponentIdFromName(opponent) {
  return Object.assign({}, opponent, {id: farmhash.fingerprint64(opponent.name)});
}

function getOpponentIdFromTeamListIfNecessary(game, teamList) {
  if (!game.opponent.id) {
    let opponent = _.find(teamList, {'name': game.opponent.name});
    if (opponent) {
      return Object.assign({}, game, {opponent});
    } else {
      return Object.assign({}, game, {opponent: generateOpponentIdFromName(game.opponent)});
    }
  } else {
    return game;
  }
}

module.exports = function scheduleHtmlToJson(html, teamList) {
  var $ = cheerio.load(html);

  return $('.mytable').first().find('tr').has('.smtext').map((index, row) => {
    var cols = $(row).children();
    var game = elementMatchers.extractGameFromElement(cols.eq(1));
    game = getOpponentIdFromTeamListIfNecessary(game, teamList);
    game.date = moment.utc(cols.eq(0).text(), 'MM/DD/YYYY');
    let result = elementMatchers.extractResultFromElement(cols.eq(2));
    if (typeof result !== 'undefined') {
      game.result = result;
    }
    return game;
  }).get();
}
