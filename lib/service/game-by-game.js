'use strict';

global.Promise = require('bluebird');
const fetchRetry = require('./fetch-retry');
const { idToSportAndInstCode } = require('../adapter/utils');
const _ = require('lodash');

const baseUrl = "http://stats.ncaa.org/player/game_by_game"
const refUrl = "?game_sport_year_ctl_id=12380&org_id=392&stats_player_seq=-100";

const scheduleCodeMap = {
  '2016': {
    'mla': 12380,
    'wla': 12385
  },
  '2017': {
    'mla': 12561,
    'wla': 12581
  }
}

function getHtmlFromNcaa(year, div, teamId) {
  let { sportCode, instCode } = idToSportAndInstCode(teamId);
  let scheduleCode = scheduleCodeMap[year][sportCode];

  let url = `${baseUrl}?game_sport_year_ctl_id=${scheduleCode}&org_id=${instCode}&stats_player_seq=-100`;
  console.log(`Getting schedule for ${year}, team ${teamId}:`, url);
  return fetchRetry(url).then((response) => {
    if (response.status != 200) {
      console.log(`Error response for`, url, response);
      throw new Error('Unable to get schedule HTML from NCAA.');
    }

    return response.text();
  });
}

module.exports = {
  getHtmlFromNcaa
};
