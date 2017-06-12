'use strict';

let _ = require('lodash');

function generateOpponentIdFromName(opponent) {
  return Object.assign({}, opponent, {id: slug(opponent.name), nonDivisional: true});
}

function getOpponentIdFromTeamList(opponent, teamList) {
  let matchedOpponent = _.find(teamList, {'name': opponent.name});
  if (matchedOpponent) {
    return matchedOpponent;
  } else {
    return generateOpponentIdFromName(opponent);
  }
}

function slug(name) {
  return name.replace(/\W+/g, '_').toLowerCase();
}

module.exports = {
  getOpponentIdFromTeamList
};
