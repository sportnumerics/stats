'use strict';

const orchestration = require('../../lib/controller/orchestration');
const predict = require('../../lib/service/predict');
const queue = require('../../lib/service/queue');
const divisions = require('../../lib/controller/divisions');
const schedule = require('../../lib/controller/schedule');
const teams = require('../../lib/controller/teams');
const sinon = require('sinon');
const fixtures = require('../fixtures');

describe('orchestration-integration', () => {
  describe('collectAllTeamsForReduction', () => {
    var divisionsMock;
    var teamsMock;
    var queueMock;

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
      
      queueMock = sinon.mock(queue)
        .expects('sendMessages')
        .withArgs(sinon.match.array.and(sinon.match.has('length', 414)))
        .exactly(1)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      divisions.collect.restore();
      teams.collect.restore();
    });

    it('should collect all teams and put them into the queue', () => {
      return orchestration.collectAllTeamsForReduction('2016').then((payload) => {
        divisionsMock.verify();
        teamsMock.verify();
        queueMock.verify();
      });
    });
  });
  
  describe('reduceOneTeam', () => {
    var scheduleMock;

    beforeEach(() => {
      scheduleMock = sinon.mock(schedule)
        .expects('collect')
        .withArgs('2016', '1', '721', sinon.match.array)
        .exactly(1)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      schedule.collect.restore();
    });

    describe('when there are teams in the queue', () => {
      var queueMock; 

      beforeEach(() => {
        let teams = fixtures.expectedTeamsJson.teams;
        let payload = {
          id: 'mock-id',
          body: {
            meta: {
              year: '2016',
              teams
            },
            team: {
              'id': '721',
              'name': 'Air Force',
              'div': '1'
            }
          }
        };

        queueMock = sinon.mock(queue)
          .expects('receiveMessage')
          .exactly(1)
          .returns(Promise.resolve(payload));
      })

      afterEach(() => {
        queue.receiveMessage.restore();
      });

      it('should remove one team from the team array and collect its schedule', () => {
        return orchestration.reduceOneTeam().then(result => {
          expect(result.done).to.be.false;
          queueMock.verify();
          scheduleMock.verify();
        });
      });
    });

    describe('when no teams are left in the queue', () => {
      var queueMock;

      beforeEach(() => {
        let teams = fixtures.expectedTeamsJson.teams;
        let payload = null;

        queueMock = sinon.mock(queue)
          .expects('receiveMessage')
          .exactly(1)
          .returns(Promise.resolve(payload));
      })

      afterEach(() => {
        queue.receiveMessage.restore();
      });

      it('should set the result to done when no message is received', () => {
        return orchestration.reduceOneTeam().then(result => {
          expect(result.done).to.be.true;
        });
      });
    });
  });
});
