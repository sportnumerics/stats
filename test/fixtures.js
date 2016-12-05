'use strict';

let fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiDateTime = require('chai-datetime'),
  chaiAsPromised = require('chai-as-promised')

chai.use(chaiDateTime);
chai.use(chaiAsPromised);

module.exports = {
  expect: chai.expect,
  teamList: fs.readFileSync(path.resolve(__dirname, './fixtures/team-list.html')),
};
