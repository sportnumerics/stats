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
  mclaTeamList: fs.readFileSync(path.resolve(__dirname, './fixtures/mcla-teams.html')),
  schedule: fs.readFileSync(path.resolve(__dirname, './fixtures/schedule.html')),
  gameByGame: fs.readFileSync(path.resolve(__dirname, './fixtures/game-by-game.html')),
  alabamaGameByGame: fs.readFileSync(path.resolve(__dirname, './fixtures/alabama-schedule.html')),
  alabama2016GameByGame: fs.readFileSync(path.resolve(__dirname, './fixtures/alabama-2016-schedule.html')),
  expectedQueryDivisionsJson: require('./fixtures/expected-query-divisions'),
  expectedStoredDivisionsJson: require('./fixtures/expected-stored-divisions'),
  expectedTeamsJson: require('./fixtures/expected-div1-teams'),
  expectedMclaTeamsJson: require('./fixtures/expected-mcla-div1-teams'),
  expectedScheduleJson: require('./fixtures/expected-721-schedule'),
  expectedGameByGameJson: require('./fixtures/expected-392-game-by-game'),
  expectedMclaGameByGameJson: require('./fixtures/expected-alabama-game-by-game'),
  expectedNormalizedGameByGameJson: require('./fixtures/expected-normalized-392-game-by-game'),
  expectedNormalizedMclaGameByGameJson: require('./fixtures/expected-normalized-alabama-game-by-game'),
  stringifyEquivalentTo: require('./fixtures/stringifyEquivalentTo'),
  snsSample: require('./fixtures/sns-sample'),
  snsPayload: require('./fixtures/sns-payload'),
  expectedSnsParams: require('./fixtures/expected-sns-params'),
  womensDivision1: require('./fixtures/womens-division-1')
};
