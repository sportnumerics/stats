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
  expectedTeamsJson: require('./fixtures/expected-div1-teams')
};
