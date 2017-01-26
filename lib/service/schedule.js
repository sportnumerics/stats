'use strict';

global.Promise = require('bluebird');
require('isomorphic-fetch');

let baseUrl = "http://stats.ncaa.org/team";
let scheduleCode = 12380;

function getHtmlFromNcaa(teamId) {
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
