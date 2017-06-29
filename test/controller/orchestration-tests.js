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
        .returns(Promise.resolve(fixtures.expectedQueryDivisionsJson.divisions));

      teamsMock = sinon.mock(teams)
        .expects('collect')
        .withArgs('2016', sinon.match.object)
        .exactly(6)
        .returns(Promise.resolve(fixtures.expectedTeamsJson.teams));

      scheduleMock = sinon.mock(schedule)
        .expects('collect')
        .withArgs('2016', sinon.match.string, sinon.match.string)
        .exactly(69*6)
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
      return orchestration.collectAll('2016', 0).then(() => {
        divisionsMock.verify();
        teamsMock.verify();
        scheduleMock.verify();
        predictMock.verify();
      });
    });
  });
});
