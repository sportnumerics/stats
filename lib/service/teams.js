'use strict';

global.Promise = require('bluebird');
require('isomorphic-fetch');

let baseUrl = "http://stats.ncaa.org/team/inst_team_list"
let refUrl = "?academic_year=2016&conf_id=-1&division=1&sport_code=MLA"

let defaultYear = 2016;
let defaultDivision = 1;

function getHtmlFromNcaa(year, division) {
  year = year || defaultYear;
  division = division || defaultDivision;

  let url = `${baseUrl}?academic_year=${year}&conf_id=-1&division=${division}&sport_code=MLA`;
  console.log(`Getting teams for ${year}, division ${division}:`, url);
  return fetch(url).then((response) => {
    if (response.status != 200) {
      console.log(`Error response for`, url, response);
      throw new Error('Unable to get team HTML from NCAA.');
    }

    return response.text();
  });
}

module.exports = {
  getHtmlFromNcaa
};
