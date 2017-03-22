'use strict';

let _ = require('lodash'),
  farmhash = require('farmhash');

function generateOpponentIdFromName(opponent) {
  return Object.assign({}, opponent, {id: farmhash.fingerprint64(opponent.name), nonDivisional: true});
}

function getOpponentIdFromTeamList(opponent, teamList) {
  let matchedOpponent = _.find(teamList, {'name': opponent.name});
  if (matchedOpponent) {
    return matchedOpponent;
  } else {
    return generateOpponentIdFromName(opponent);
  }
}

module.exports = {
  getOpponentIdFromTeamList
};
