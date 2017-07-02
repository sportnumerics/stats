'use strict';

const orchestration = require('../../lib/controller/orchestration');
const predict = require('../../lib/service/predict');
const divisions = require('../../lib/controller/divisions');
const schedule = require('../../lib/controller/schedule');
const teams = require('../../lib/controller/teams');
const sinon = require('sinon');
const fixtures = require('../fixtures');

describe('orchestration-integration', () => {
  describe('collectAllTeamsForReduction', () => {
    var divisionsMock;
    var teamsMock;

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
    });

    afterEach(() => {
      divisions.collect.restore();
      teams.collect.restore();
    });

    it('should collect all teams', () => {
      return orchestration.collectAllTeamsForReduction('2016').then((payload) => {
        divisionsMock.verify();
        teamsMock.verify();
        expect(payload.meta.teams).to.have.lengthOf(414);
        expect(payload.meta.year).to.equal('2016');
        expect(payload.array).to.have.lengthOf(414);
        expect(payload.result).to.be.empty;
      });
    });
  });
  
  describe('reduceOneTeam', () => {
    var scheduleMock;

    beforeEach(() => {
      scheduleMock = sinon.mock(schedule)
        .expects('collect')
        .withArgs('2016', sinon.match.string, sinon.match.string, sinon.match.array)
        .exactly(1)
        .returns(Promise.resolve());
    })

    afterEach(() => {
      schedule.collect.restore();
    });

    it('should remove one team from the team array and collect its schedule', () => {
      let teams = fixtures.expectedTeamsJson.teams;
      let payload = {
        meta: {
          year: '2016',
          teams
        },
        array: teams,
        result: {}
      };

      let startingLength = teams.length;
      let firstTeam = teams[0]

      return orchestration.reduceOneTeam(payload).then((result) => {
        expect(result.array).to.have.lengthOf(startingLength - 1);
        expect(result.done).to.be.false;
      });
    });

    it('should set the result to done when the last team is processed', () => {
      let teams = [fixtures.expectedTeamsJson.teams[0]];
      let payload = {
        meta: {
          year: '2016',
          teams: fixtures.expectedTeamsJson.teams
        },
        array: teams,
        result: {}
      };

      return orchestration.reduceOneTeam(payload).then((result) => {
        expect(result.array).to.have.lengthOf(0);
        expect(result.done).to.be.true;
      });
    });
  });
});
