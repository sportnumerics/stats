'use strict';

const persistence = require('../service/persistence-s3');
const config = require('config');
const _ = require('lodash');
const divisions = require('../data/divisions');

async function persist(year, divisions) {
  let storedDivs = _.map(divisions, div => _.pick(div, 'id', 'title', 'sport'));
  await persistence.set(config.ResultsBucket, `${year}/divisions.json`, storedDivs);

  return divisions;
}

function collect(year) {
  console.log(`Persisting divisions for ${year}`);
  return persist(year, divisions);
};

module.exports = {
  collect
};
