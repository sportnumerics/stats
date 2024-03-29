'use strict';

global.Promise = require('bluebird');
const fetchRetry = require('./fetch-retry');
const { idToSportAndInstCode } = require('../adapter/utils');
const scheduleCodeMap = require('./ncaaScheduleCodes.js');
const _ = require('lodash');

const baseNcaaUrl = 'http://stats.ncaa.org/player/game_by_game';
const refUrl = '?game_sport_year_ctl_id=12380&org_id=392&stats_player_seq=-100';

async function getHtmlFromNcaa(year, team) {
  let { sport, instCode, id } = team;
  let scheduleCode = scheduleCodeMap[year][sport];

  let url = `${baseNcaaUrl}?game_sport_year_ctl_id=${scheduleCode}&org_id=${instCode}&stats_player_seq=-100`;
  console.log(`Getting schedule for ${year}, team ${id}:`, url);
  const response = await fetchRetry(url)

  if (response.status != 200) {
    console.log(`Error response for`, url, response);
    throw new Error('Unable to get schedule HTML from NCAA.');
  }

  return response.text();
}

async function getHtmlFromMcla(year, team) {
  const { instCode, id } = team;

  const url = `http://mcla.us/team/${instCode}/${year}/schedule.html`;

  console.log(`Getting schedule for ${year}, team ${id}:`, url);
  const response = await fetchRetry(url);

  if (response.status != 200) {
    throw new Error('Unable to get schedule from MCLA.');
  }

  return response.text();
}

module.exports = {
  getHtmlFromNcaa,
  getHtmlFromMcla
};
