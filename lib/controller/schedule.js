'use strict';

const scheduleHtmlToJson = require('../adapter/schedule-html-to-json');
const gameByGameHtmlToJson = require('../adapter/game-by-game-html-to-json');
const persistence = require('../service/persistence');
const scheduleService = require('../service/schedule');
const gameByGameService = require('../service/game-by-game');
const config = require('config');
const _ = require('lodash');

const service = gameByGameService;
const adapter = gameByGameHtmlToJson;

function collect(year, div, teamId, teamList) {
  return service.getHtmlFromNcaa(year, teamId)
    .then(gameHtml => {
      let schedule = adapter(gameHtml, teamList);
      let team = _.find(teamList, { 'id': teamId });
      return Object.assign({}, team, { div, schedule });
    }).then(data => {
      console.log(`Persisting team id ${teamId}`);
      let id = teamId;
      let season = year;
      return persistence.set(config.ResultsTable, { id, season }, data);
    }).catch(err => {
      console.error(`Error persisting schedule`, err);
    });
};

module.exports = {
  collect,
  service
};
