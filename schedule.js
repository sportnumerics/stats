'use strict';

const schedule = require('./lib/controller/schedule');

function collect(event, context, callback) {
  schedule.collect('721').asCallback(callback);
}

module.exports = {
  collect
}
