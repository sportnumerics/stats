'use strict';

const scheduleHtmlToJson = require('../adapter/schedule-html-to-json');
const gameByGameHtmlToJson = require('../adapter/game-by-game-html-to-json');
const persistence = require('../service/persistence');
const scheduleService = require('../service/schedule');
const gameByGameService = require('../service/game-by-game');
const config = require('config');

const service = gameByGameService;
const adapter = gameByGameHtmlToJson;

function collect(year, teamId, teamList) {
  return service.getHtmlFromNcaa(year, teamId)
    .then(gameHtml => {
      return adapter(gameHtml, teamList);
    }).then(schedule => {
      console.log(`Persisting schedule for team id ${teamId}`);
      console.log(JSON.stringify(schedule));
      return persistence.set(config.ResultsTable, { id: teamId, year }, { schedule });
    });
};

module.exports = {
  collect,
  service
};
