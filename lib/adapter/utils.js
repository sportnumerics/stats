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

const ID_SEPARATOR = '-'

function slug(name) {
  return name.replace(/\W+/g, ID_SEPARATOR).toLowerCase();
}

function idToSportAndInstCode(id) {
  let [sportCode, ...rest] = id.split(ID_SEPARATOR);
  return {
    sportCode,
    instCode: rest.join('-')
  }
}

function sanitizeInstCode(instCode) {
  return instCode.replace(/_/g, '-').toLowerCase();
}

function sportAndInstCodeToId(sportCode, instCode) {
  return [sportCode, sanitizeInstCode(instCode)].join(ID_SEPARATOR);
}

function addTeamId(team) {
  let sport = team.sport;
  let inst = team.instCode;
  return Object.assign({}, team, { id: sportAndInstCodeToId(sport, inst)});
}

module.exports = {
  idToSportAndInstCode,
  sportAndInstCodeToId,
  getOpponentIdFromTeamList,
  slug,
  addTeamId
};
