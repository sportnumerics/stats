'use strict';

const teams = require('./lib/controller/teams');

function collect(event, context, callback) {
  teams.collect('2016', '1').asCallback(callback);
}

module.exports = {
  collect
}
