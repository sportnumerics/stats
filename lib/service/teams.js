'use strict';

global.Promise = require('bluebird');
const fetchRetry = require('./fetch-retry');

let baseNcaaUrl = "http://stats.ncaa.org/team/inst_team_list"
// reference query string: ?academic_year=2016&conf_id=-1&division=1&sport_code=MLA

let defaultYear = 2016;

function getHtmlFromNcaa(year, division) {
  year = year || defaultYear;
  let source = division.source;

  let url = `${baseNcaaUrl}?academic_year=${year}&conf_id=-1&division=${source.id}&sport_code=${source.sportCode}`;
  console.log(`Getting teams for ${year}, sport ${source.sportCode}, division ${source.id}:`, url);
  return fetchRetry(url).then((response) => {
    if (response.status != 200) {
      console.log(`Error response for`, url, response);
      throw new Error('Unable to get team HTML from NCAA.');
    }

    return response.text();
  });
}

let baseMclaUrl = 'http://mcla.us/teams';

async function getHtmlFromMcla(year, divison) {
  let url = `${baseMclaUrl}/${year}`;
  console.log(`Fetching ${url}`);
  const response = await fetchRetry(url);

  if (response.status != 200) {
    throw new Error('Unable to get team HTML from MCLA');
  }

  return await response.text();
}

module.exports = {
  getHtmlFromNcaa,
  getHtmlFromMcla
};
