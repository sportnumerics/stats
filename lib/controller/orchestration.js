'use strict';

const predict = require('../service/predict');
const divisions = require('./divisions');
const teams = require('./teams');
const schedule = require('./schedule');
const _ = require('lodash');
const queue = require('../service/queue');
const teamsDdbEventToTeams = require('../adapter/teams-ddb-event-to-teams');

const SCHEDULE_COLLECTION_CONCURRENCY = 3;

function collectAllTeamsForReduction({ year }) {
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
    .then(() => ({ year }));
}

function reduceTeams(props) {
  let failed = props.failed || [];
  let successful = props.successful || [];
  return queue.receiveMessages()
    .then(messages => {
      if (!_.isEmpty(messages)) {
        return Promise.map(messages, message => {
            let team = message.body;
            return schedule.collect(team)
              .then(() => {
                successful.push(team.id);
              })
              .catch(error => {
                console.error(`Failed to collect schedule for team ${team.id} (${team.year}).`);
                failed.push({id: team.id, error });
              })
              .then(() => queue.deleteMessage(message.id))
          }, { concurrency: SCHEDULE_COLLECTION_CONCURRENCY })
          .then(() => Object.assign({}, props, { done: false, successful, failed }));
      } else {
        // TODO: need to verify if receive message will always return empty
        // if there are no more messages in the queue.
        return Object.assign({}, props, { done: true });
      }
    });
}

function normalizeTeams({year}) {
  return teams.normalize(year);
}

module.exports = {
  collectAllTeamsForReduction,
  reduceTeams,
  normalizeTeams
};
