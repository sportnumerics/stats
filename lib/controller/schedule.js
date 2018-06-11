'use strict';

const ncaaGameByGameHtmlToJson = require('../adapter/ncaa-game-by-game-html-to-json');
const mclaGameByGameHtmlToJson = require('../adapter/mcla-game-by-game-html-to-json');
const persistence = require('../service/persistence');
const service = require('../service/game-by-game');
const config = require('config');
const _ = require('lodash');

const sourceMapping = {
  'ncaa': () => service.getHtmlFromNcaa,
  'mcla': () => service.getHtmlFromMcla
};

const adapterMapping = {
  'ncaa': () => ncaaGameByGameHtmlToJson,
  'mcla': () => mclaGameByGameHtmlToJson
}

async function collect(team) {
  const service = sourceMapping[team.source.type]();
  const adapter = adapterMapping[team.source.type]();

  const gameHtml = await service(team.year, team)

  let schedule = adapter(gameHtml);

  const data = Object.assign({}, team, { schedule });

  let { id, year } = team;
  return Object.assign({}, team, data);
};

module.exports = {
  collect
};
