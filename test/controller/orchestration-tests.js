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
        .returns(Promise.resolve(fixtures.expectedQueryDivisionsJson));

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
    describe('when things go well', () => {
      var scheduleMock;

      beforeEach(() => {
        scheduleMock = sinon.mock(schedule);

        scheduleMock
          .expects('collect')
          .withArgs({ id: sinon.match.string, name: sinon.match.string, div: sinon.match.string, year: sinon.match.string })
          .exactly(2)
          .returns(Promise.resolve());
      });

      afterEach(() => {
        scheduleMock.restore();
      });

      describe('when there are teams in the queue', () => {
        var queueMock; 

        beforeEach(() => {
          let messages = [
            {
              id: 'mock-id',
              body: { 
                id: 'mla-721',
                name: 'Air Force',
                div: 'm1',
                year: '2016'
              }
            },
            {
              id: 'mock-id',
              body: { 
                id: 'mla-722',
                name: 'Colorado',
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
          let props = {
            other: 'value',
            successful: ['succ-123'],
            failed: [{
              id: 'fail-123',
              error: 'mock error'
            }]
          }

          return orchestration.reduceTeams(props).then(result => {
            expect(result.done).to.be.false;
            expect(result.other).to.equal('value');
            expect(result.successful).to.deep.equal(['succ-123', 'mla-721', 'mla-722']);
            expect(result.failed).to.deep.equal([{
              id: 'fail-123',
              error: 'mock error'
            }]);
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
          let props = {
            other: 'value',
            successful: ['succ-123'],
            failed: [{
              id: 'fail-123',
              error: 'mock error'
            }]
          }
          return orchestration.reduceTeams(props).then(result => {
            expect(result.done).to.be.true;
            expect(result.other).to.equal('value');
            expect(result.successful).to.deep.equal(['succ-123']);
            expect(result.failed).to.deep.equal([{
              id: 'fail-123',
              error: 'mock error'
            }]);
            queueMock.verify();
          });
        });
      });
    });

    describe('when an error occurs during collection', () => {
      var queueMock;
      var scheduleMock;

      beforeEach(() => {
        let teams = fixtures.expectedTeamsJson.teams;
        let messages = [{
          id: 'mock-id',
          body: { 
            id: 'mla-721',
            name: 'Air Force',
            div: 'm1',
            year: '2016'
          }
        }];

        queueMock = sinon.mock(queue);

        queueMock
          .expects('receiveMessages')
          .exactly(1)
          .returns(Promise.resolve(messages));

        queueMock.expects('deleteMessage')
          .exactly(1)
          .withArgs('mock-id')
          .returns(Promise.resolve());
        
        scheduleMock = sinon.mock(schedule);

        scheduleMock
          .expects('collect')
          .withArgs({ id: sinon.match.string, name: sinon.match.string, div: sinon.match.string, year: sinon.match.string })
          .returns(Promise.reject(new Error('schedule error')));
      })

      afterEach(() => {
        queueMock.restore();
        scheduleMock.restore();
      });

      it('should add an error object to the results', () => {
        let props = {
          other: 'value',
          successful: ['succ-123'],
          failed: [{
            id: 'fail-123',
            error: 'mock error'
          }]
        }
        return orchestration.reduceTeams(props).then(result => {
          expect(result.done).to.be.false;
          expect(result.other).to.equal('value');
          expect(result.successful).to.deep.equal(['succ-123']);
          expect(result.failed).to.deep.equal([{
            id: 'fail-123',
            error: 'mock error'
          }, {
            id: 'mla-721',
            error: new Error('schedule error')
          }]);
          queueMock.verify();
        });
      });
    });
  });

  describe('normalizeTeams', () => {
    it('should use the teams controller to normalize the teams for a given year', () => {
      let teamsMock = sinon.mock(teams);

      teamsMock.expects('normalize')
        .withArgs('2016')
        .returns(Promise.resolve())

      return orchestration.normalizeTeams('2016')
        .then(() => {
          teamsMock.verify();
        }).finally(() => {
          teamsMock.restore();
        });
    });
  });
});
