'use strict';

global.Promise = require('bluebird');
require('isomorphic-fetch');

const baseUrl = "http://stats.ncaa.org/team";

const scheduleCodeMap = {
  '2016': 12380,
  '2017': 12561
}

function getHtmlFromNcaa(year, teamId) {
  let scheduleCode = scheduleCodeMap[year];

  let url = `${baseUrl}/${teamId}/${scheduleCode}`;

  return fetch(url).then((response) => {
    if (response.status != 200) {
      throw new Error('Unable to get schedule HTML from NCAA.');
    }

    return response.text();
  });
}

module.exports = {
  getHtmlFromNcaa
};
