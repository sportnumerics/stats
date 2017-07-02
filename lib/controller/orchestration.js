'use strict';

const predict = require('../service/predict');
const divisions = require('./divisions');
const teams = require('./teams');
const schedule = require('./schedule');
const _ = require('lodash');

function collectAllTeamsForReduction(year) {
  return divisions.collect(year).then((divs) => {
    return Promise.map(divs, (div) => {
      return teams.collect(year, div);
    });
  }).then((divs) => {
    let teams = _.flatMap(divs);
    return {
      meta: {
        teams,
        year
      },
      array: teams,
      result: {}
    };
  });
}

function reduceOneTeam({ meta, array, result }) {
  let [team, ...rest] = array;
  return schedule.collect(meta.year, team.div, team.id, meta.teams)
    .then(() => true)
    .catch(() => false)
    .then((successful) => {
      return {
        meta,
        array: rest,
        result: Object.assign({}, result, { [team.id]: successful }),
        done: rest.length == 0
      }
    });
}

module.exports = {
  collectAllTeamsForReduction,
  reduceOneTeam
};
