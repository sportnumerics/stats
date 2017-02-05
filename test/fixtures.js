'use strict';

let fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiDateTime = require('chai-datetime'),
  chaiAsPromised = require('chai-as-promised'),
  chaiMoment = require('chai-moment');

chai.use(chaiDateTime);
chai.use(chaiAsPromised);
chai.use(chaiMoment);
global.expect = chai.expect;

module.exports = {
  teamList: fs.readFileSync(path.resolve(__dirname, './fixtures/team-list.html')),
  schedule: fs.readFileSync(path.resolve(__dirname, './fixtures/schedule.html')),
  expectedTeamsJson: require('./fixtures/expected-div1-teams'),
  expectedScheduleJson: require('./fixtures/expected-721-schedule'),
  stringifyEquivalentTo: require('./fixtures/stringifyEquivalentTo'),
  snsSample: require('./fixtures/sns-sample'),
  snsPayload: require('./fixtures/sns-payload'),
  expectedSnsParams: require('./fixtures/expected-sns-params')
};
