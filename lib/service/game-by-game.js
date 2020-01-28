'use strict';

global.Promise = require('bluebird');
const fetchRetry = require('./fetch-retry');
const { idToSportAndInstCode } = require('../adapter/utils');
const _ = require('lodash');

const baseNcaaUrl = 'http://stats.ncaa.org/player/game_by_game';
const refUrl = '?game_sport_year_ctl_id=12380&org_id=392&stats_player_seq=-100';

const scheduleCodeMap = {
  '2016': {
    mla: 12380,
    wla: 12385
  },
  '2017': {
    mla: 12561,
    wla: 12581
  },
  '2018': {
    mla: 13920,
    wla: 12926
  },
  '2019': {
    mla: 14840,
    wla: 14340
  },
  '2020': {
    mla: 15203,
    wla: 15181
  }
};

function getHtmlFromNcaa(year, team) {
  let { sport, instCode, id } = team;
  let scheduleCode = scheduleCodeMap[year][sport];

  let url = `${baseNcaaUrl}?game_sport_year_ctl_id=${scheduleCode}&org_id=${instCode}&stats_player_seq=-100`;
  console.log(`Getting schedule for ${year}, team ${id}:`, url);
  return fetchRetry(url).then(response => {
    if (response.status != 200) {
      console.log(`Error response for`, url, response);
      throw new Error('Unable to get schedule HTML from NCAA.');
    }

    return response.text();
  });
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
