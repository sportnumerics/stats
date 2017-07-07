'use strict';

const gameByGameHtmlToJson = require('../adapter/game-by-game-html-to-json');
const persistence = require('../service/persistence');
const gameByGameService = require('../service/game-by-game');
const config = require('config');
const _ = require('lodash');

const service = gameByGameService;
const adapter = gameByGameHtmlToJson;

function collect(team) {
  return service.getHtmlFromNcaa(team.year, team.div, team.id)
    .then(gameHtml => {
      let schedule = adapter(gameHtml);
      return Object.assign({}, team, { schedule });
    }).then(data => {
      console.log(`Persisting team id ${team.id}`);
      let { id, year } = team;
      return persistence.set(config.ResultsTable, { id, year }, data);
    }).catch(err => {
      console.error(`Error persisting schedule`, err);
    });
};

module.exports = {
  collect,
  service
};
