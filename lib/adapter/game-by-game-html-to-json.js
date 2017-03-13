'use strict';

let cheerio = require('cheerio'),
  _ = require('lodash'),
  moment = require('moment'),
  elementMatchers = require('./element-matchers');

module.exports = function gameByGameHtmlToJson(html) {
  var $ = cheerio.load(html);

  var table = $('.mytable').eq(1);

  var extractor = columnExtractor(table);

  return table.find('tr').has('.smtext').map((index, row) => {
    let items = extractor(cheerio(row).find('td'));
    let date = getDate(items.date);
    let {opponent, location} = elementMatchers.extractGameFromElement(items.opponent);
    let result = getResult(items.goalsFor, items.goalsAgainst);

    return {
      date,
      opponent,
      location,
      result
    };
  }).get();
}

function columnExtractor(table) {
  const keyToHeading = {
    'date': 'Date',
    'opponent': 'Opponent',
    'goalsFor': 'Goals',
    'goalsAgainst': 'Goals Allowed'
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

function getDate(cell) {
  return moment.utc(_.trim(cell.text()), 'MM/DD/YYYY');
}

function getResult(goalsCell, goalsAgainstCell) {
  return {
    pointsFor: parseInt(goalsCell.text()),
    pointsAgainst: parseInt(goalsAgainstCell.text())
  };
}
