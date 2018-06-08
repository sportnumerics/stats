'use strict';

const persistence = require('../service/persistence-s3');
const config = require('config');
const _ = require('lodash');
const divisions = require('../data/divisions');

function persist(year, divisions) {
  let storedDivs = _.map(divisions, div => _.pick(div, 'id', 'title', 'sport'));
  return Promise.map(storedDivs, div => {
    return persistence.set(config.DivisionsBucket, `${year}/${div.id}`, div);
  }).then(() => divisions);
}

function collect(year) {
  console.log(`Persisting divisions for ${year}`);
  return persist(year, divisions);
};

module.exports = {
  collect
};
