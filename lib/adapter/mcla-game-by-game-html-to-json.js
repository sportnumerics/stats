'use strict';

const cheerio = require('cheerio'),
  _ = require('lodash'),
  moment = require('moment'),
  elementMatchers = require('./element-matchers'),
  utils = require('./utils');

module.exports = function gameByGameHtmlToJson(html, year) {
  var $ = cheerio.load(html);

  var table = $('.team-schedule').eq(1);

  var extractor = columnExtractor(table);

  return table.find('tbody tr').map((index, row) => {
    let items = extractor(cheerio(row).find('td'));

    let game = elementMatchers.extractGameFromElement(items.opponent);

    game.date = getDate(items.date, year);
    const result = getResult(items.results);
    if (result) {
      game.result = result;
    }

    return game;
  }).get();
}

function columnExtractor(table) {
  const keyToHeading = {
    'date': 'Date',
    'opponent': 'Opponent',
    'venue': 'Venue',
    'results': 'Results'
  };

  function getColumnIndex(headings, row, key) {
    let index = _.indexOf(headings, keyToHeading[key]);
    return row.find('td').eq(index);
  }

  const headings = table.find('th').map((index, item) => cheerio(item).text());

  return (row) => {
    return _.mapValues(keyToHeading, (heading) => {
      let index = _.indexOf(headings, heading);
      if (index === -1) throw new Error(`Unable to find column ${heading}`);
      return row.eq(index);
    });
  };
}

function getDate(cell, year) {
  const dateStringWithYear = `${year} ${_.trim(cell.text())}`
  const date = moment.utc(dateStringWithYear, 'YYYY ddd MMM DD hh:mma').toISOString();
  return date;
}

function getResult(resultsCell) {
  const matches = resultsCell.text().match(/(Won|Lost) \((\d+)-(\d+)\)/);
  if (!matches) {
    return undefined;
  }
  let pointsFor = parseInt(matches[2]),
    pointsAgainst = parseInt(matches[3]);
  if (!_.isNaN(pointsFor) && !_.isNaN(pointsAgainst)) {
    return {
      pointsFor,
      pointsAgainst
    };
  } else {
    return undefined;
  }
}

