'use strict';

const teams = require('./lib/controller/teams');

function collect(event, context, callback) {
  const year = '2016';
  const div = '1';
  teams.collect(year, div).asCallback(callback);
}

module.exports = {
  collect
};
