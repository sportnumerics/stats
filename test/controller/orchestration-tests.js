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
      
      queueMock = sinon.mock(queue);

      queueMock
        .expects('sendMessages')
        .withArgs(sinon.match.array.and(sinon.match.has('length', 414)))
        .exactly(1)
        .returns(Promise.resolve());

      queueMock
        .expects('purgeQueue')
        .returns(Promise.resolve());
    });

    afterEach(() => {
      divisions.collect.restore();
      teams.collect.restore();
      queueMock.restore();
    });

    it('should collect all teams and put them into the queue', () => {
      return orchestration.collectAllTeamsForReduction('2016').then(() => {
        divisionsMock.verify();
        teamsMock.verify();
        queueMock.verify();
      });
    });
  });
  
  describe('reduceTeams', () => {
    var scheduleMock;

    beforeEach(() => {
      scheduleMock = sinon.mock(schedule)
        .expects('collect')
        .withArgs({ id: '721', name: 'Air Force', div: 'm1', year: '2016' })
        .exactly(2)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      schedule.collect.restore();
    });

    describe('when there are teams in the queue', () => {
      var queueMock; 

      beforeEach(() => {
        let teams = fixtures.expectedTeamsJson.teams;
        let messages = [
          {
            id: 'mock-id',
            body: { 
              id: '721',
              name: 'Air Force',
              div: 'm1',
              year: '2016'
            }
          },
          {
            id: 'mock-id',
            body: { 
              id: '721',
              name: 'Air Force',
              div: 'm1',
              year: '2016'
            }
          }
        ];

        queueMock = sinon.mock(queue);

        queueMock.expects('receiveMessages')
          .exactly(1)
          .returns(Promise.resolve(messages));

        queueMock.expects('deleteMessage')
          .exactly(2)
          .withArgs('mock-id')
          .returns(Promise.resolve());
      })

      afterEach(() => {
        queueMock.restore();
      });

      it('should collect their schedules and remove them from the team queue', () => {
        return orchestration.reduceTeams().then(result => {
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
        let messages = [];

        queueMock = sinon.mock(queue);

        queueMock
          .expects('receiveMessages')
          .exactly(1)
          .returns(Promise.resolve(messages));
      })

      afterEach(() => {
        queueMock.restore();
      });

      it('should set the result to done when no message is received', () => {
        return orchestration.reduceTeams().then(result => {
          expect(result.done).to.be.true;
          queueMock.verify();
        });
      });
    });
  });
});
