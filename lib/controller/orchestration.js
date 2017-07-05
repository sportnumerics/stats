'use strict';

const predict = require('../service/predict');
const divisions = require('./divisions');
const teams = require('./teams');
const schedule = require('./schedule');
const _ = require('lodash');
const queue = require('../service/queue');
const teamsDdbEventToTeams = require('../adapter/teams-ddb-event-to-teams');

const EMPTY_RESPONSE = undefined;
const SCHEDULE_COLLECTION_CONCURRENCY = 3;

function collectAllTeamsForReduction(year) {
  return queue.purgeQueue()
    .then(() => {
      return divisions.collect(year).then((divs) => {
          return Promise.map(divs, (div) => {
            return teams.collect(year, div);
          });
        });
    }).then((divs) => {
      let teams = _.flatMap(divs);
      console.log(`Received ${teams.length} teams. Sending to SQS.`);
      return queue.sendMessages(teams);
    })
    .then(() => EMPTY_RESPONSE);
}

function reduceTeams() {
  return queue.receiveMessages()
    .then(messages => {
      if (!_.isEmpty(messages)) {
        return Promise.map(messages, message => {
            let team = message.body;
            return schedule.collect(team)
              .catch(() => {
                console.error(`Failed to collect schedule for team ${team.id} (${team.year}).`);
              })
              .then(() => queue.deleteMessage(message.id))
          }, { concurrency: SCHEDULE_COLLECTION_CONCURRENCY })
          .then(() => ({ done: false }));
      } else {
        // TODO: need to verify if receive message will always return empty
        // if there are no more messages in the queue.
        return { done: true };
      }
    });
}

function onTeamsModified(event) {
  return Promise.try(() => {
    console.log('Event:', event);
    console.log('Teams: ', teamsDdbEventToTeams(event));
  });
}

module.exports = {
  collectAllTeamsForReduction,
  reduceTeams,
  onTeamsModified
};
