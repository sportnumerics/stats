'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

let baseUrl = "http://stats.ncaa.org/team/inst_team_list"
let refUrl = "?academic_year=2016&conf_id=-1&division=1&sport_code=MLA"

let defaultYear = 2016;
let defaultDivision = 1;

function getHtmlFromNcaa(year, division) {
  year = year || defaultYear;
  division = division || defaultDivision;

  let url = `${baseUrl}?academic_year=${year}&conf_id=-1&division=${division}&sport_code=MLA`;

  return fetch(url).then((response) => {
    if (response.status != 200) {
      throw new Error('Unable to get team HTML from NCAA.');
    }

    return response.text();
  });
}

module.exports = {
  getHtmlFromNcaa
};
