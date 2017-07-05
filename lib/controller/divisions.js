'use strict';

const persistence = require('../service/persistence');
const config = require('config');
const _ = require('lodash');

const divisions = [
  {
    'id': 'm1',
    'sport': 'mla',
    'source': {
      'type': 'ncaa',
      'id': '1',
      'sportCode': 'MLA'
    },
    'title': 'NCAA Men\'s Division 1'
  },
  {
    'id': 'm2',
    'sport': 'mla',
    'source': {
      'type': 'ncaa',
      'id': '2',
      'sportCode': 'MLA'
    },
    'title': 'NCAA Men\'s Division 2'
  },
  {
    'id': 'm3',
    'sport': 'mla',
    'source': {
      'type': 'ncaa',
      'id': '3',
      'sportCode': 'MLA'
    },
    'title': 'NCAA Men\'s Division 3'
  },
  {
    'id': 'w1',
    'sport': 'wla',
    'source': {
      'type': 'ncaa',
      'id': '1',
      'sportCode': 'WLA'
    },
    'title': 'NCAA Women\'s Division 1'
  },
  {
    'id': 'w2',
    'sport': 'wla',
    'source': {
      'type': 'ncaa',
      'id': '2',
      'sportCode': 'WLA'
    },
    'title': 'NCAA Women\'s Division 2'
  },
  {
    'id': 'w3',
    'sport': 'wla',
    'source': {
      'type': 'ncaa',
      'id': '3',
      'sportCode': 'WLA'
    },
    'title': 'NCAA Women\'s Division 3'
  }
];

function persist(year, divisions) {
  let storedDivs = _.map(divisions, div => _.pick(div, 'id', 'title', 'sport'));
  return Promise.map(storedDivs, div => {
    return persistence.set(config.DivisionsTable, { id: div.id, year }, div);
  }).then(() => divisions);
}

function collect(year) {
  console.log(`Persisting divisions for ${year}`);
  return persist(year, divisions);
};

module.exports = {
  collect
};
