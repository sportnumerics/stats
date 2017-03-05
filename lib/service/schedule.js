'use strict';

global.Promise = require('bluebird');
const fetchRetry = require('./fetch-retry');

const baseUrl = "http://stats.ncaa.org/team";

const scheduleCodeMap = {
  '2016': 12380,
  '2017': 12561
}

function getHtmlFromNcaa(year, teamId) {
  let scheduleCode = scheduleCodeMap[year];

  let url = `${baseUrl}/${teamId}/${scheduleCode}`;
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
