'use strict';

const predict = require('../service/predict');
const divisions = require('./divisions');
const teams = require('./teams');
const schedule = require('./schedule');
const _ = require('lodash');
const queue = require('../service/queue');

function collectAllTeamsForReduction(year) {
  return divisions.collect(year).then((divs) => {
    return Promise.map(divs, (div) => {
      return teams.collect(year, div);
    });
  }).then((divs) => {
    let teams = _.flatMap(divs);
    console.log(`Received ${teams.length} teams. Sending to SQS.`);
    let teamsWithMetadata = teams.map(team => (
      {
        team,
        meta: {
          teams,
          year
        }
      }
    ));
    return queue.sendMessages(teamsWithMetadata);
  });
}

function reduceOneTeam() {
  return queue.receiveMessage()
    .then(message => {
      if (message) {
        let { team, meta } = message.body;
        return schedule.collect(meta.year, team.div, team.id, meta.teams)
          .then(() => ({ done: false }));
      } else {
        // TODO: need to verify if receive message will always return null
        // if there are no more messages in the queue.
        return { done: true };
      }
    });
}

module.exports = {
  collectAllTeamsForReduction,
  reduceOneTeam
};
