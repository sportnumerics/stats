'use strict';

const _ = require('lodash');
const utils = require('./utils');

const normalizeTeam = (teams, divs) => (team) => {
  let schedule = normalizeSchedule(team.schedule);

  return Object.assign({}, team, { schedule });

  function normalizeSchedule(schedule) {
    return schedule.map(game => {
      let opponent = normalizeOpponent(game.opponent)
      return Object.assign({}, game, { opponent });
    });
  }

  function normalizeOpponent(opponent) {
    let normalizedOpponent = _.find(teams, candidateMatchesOpponent(opponent));
    if (normalizedOpponent) {
      return divisionalOpponent(normalizedOpponent);
    } else {
      return nonDivisionalOpponent(opponent);
    }
  }

  function candidateMatchesOpponent(opponent) {
    return (candidate) => namesMatch(candidate, opponent) && sportsMatch(candidate, team);
  }

  function divisionalOpponent(opponent) {
    return _.pick(opponent, ['name', 'id', 'div'])
  }

  function nonDivisionalOpponent(opponent) {
    return Object.assign({}, opponent, { id: utils.slug(opponent.name), nonDivisional: true })
  }

  function namesMatch(teamA, teamB) {
    return teamA.name === teamB.name;
  }

  function sportsMatch(teamA, teamB) {
    return sportForTeam(teamA) === sportForTeam(teamB);
  }

  function sportForTeam(team) {
    return _.find(divs, { id: team.div }).sport;
  }
};

module.exports = normalizeTeam;