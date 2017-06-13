'use strict';

const persistence = require('../service/persistence');
const config = require('config')

const divisions = [
  {
    'id': '1',
    'title': 'NCAA Division 1'
  },
  {
    'id': '2',
    'title': 'NCAA Division 2'
  },
  {
    'id': '3',
    'title': 'NCAA Division 3'
  }
];

function persist(season, divisions) {
  return persistence.set(config.DivisionsTable, {season}, {divisions})
    .then(() => divisions);
}

function collect(year) {
  console.log(`Persisting divisions for ${year}`);
  return persist(year, divisions);
};

module.exports = {
  collect
};
