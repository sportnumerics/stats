'use strict';

let fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiDateTime = require('chai-datetime'),
  chaiAsPromised = require('chai-as-promised')

chai.use(chaiDateTime);
chai.use(chaiAsPromised);
global.expect = chai.expect;

module.exports = {
  teamList: fs.readFileSync(path.resolve(__dirname, './fixtures/team-list.html')),
  schedule: fs.readFileSync(path.resolve(__dirname, './fixtures/schedule.html')),
  expectedTeamsJson: require('./fixtures/expected-div1-teams'),
  expectedScheduleJson: require('./fixtures/expected-721-schedule'),
  stringifyEquivalentTo: require('./fixtures/stringifyEquivalentTo')
};
