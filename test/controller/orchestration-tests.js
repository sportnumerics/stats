'use strict';

const orchestration = require('../../lib/controller/orchestration');
const predict = require('../../lib/service/predict');
const divisions = require('../../lib/controller/divisions');
const schedule = require('../../lib/controller/schedule');
const teams = require('../../lib/controller/teams');
const sinon = require('sinon');
const fixtures = require('../fixtures');

describe('orchestration-integration', () => {
  describe('collectAll', () => {
    var scheduleMock;
    var teamsMock;
    var divisionsMock;
    var predictMock;

    beforeEach(() => {
      divisionsMock = sinon.mock(divisions)
        .expects('collect')
        .withArgs('2016')
        .returns(Promise.resolve(fixtures.expectedDivisionsJson.divisions));

      teamsMock = sinon.mock(teams)
        .expects('collect')
        .withArgs('2016', sinon.match.string)
        .exactly(3)
        .returns(Promise.resolve(fixtures.expectedTeamsJson.teams));

      scheduleMock = sinon.mock(schedule)
        .expects('collect')
        .withArgs('2016', sinon.match.string, sinon.match.string)
        .exactly(69*3)
        .returns(Promise.resolve(fixtures.expectedScheduleJson.schedule));

      predictMock = sinon.mock(predict)
        .expects('initiate')
        .withArgs('2016')
        .returns(Promise.resolve());
    });

    afterEach(() => {
      divisions.collect.restore();
      schedule.collect.restore();
      teams.collect.restore();
      predict.initiate.restore();
    });

    it('should collect all teams and schedules', () => {
      var promise = orchestration.collectAll('2016', 0).then(() => {
        divisionsMock.verify();
        teamsMock.verify();
        scheduleMock.verify();
        predictMock.verify();
      });

      return expect(promise).to.be.fulfilled;
    });
  });
});
