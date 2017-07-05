'use strict';

const handler = require('../../handler');
const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const queue = require('../../lib/service/queue');
const fixtures = require('../fixtures');
const nock = require('nock');

describe('handler-integration', () => {
  describe('collectAllTeamsForReduction', () => {
    let persistenceMock;
    let queueMock;

    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).times(6).reply(200, fixtures.teamList);

      persistenceMock = sinon.mock(persistence);

      persistenceMock.expects('set')
        .exactly(6)
        .returns(Promise.resolve());

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
      persistenceMock.restore();
      queueMock.restore();
    });

    it('should persist the divisions, add teams to the queue, and return nothing', done => {
      handler.collectAllTeamsForReduction({}, {}, (error, data) => {
        expect(error).to.be.null;
        expect(data).to.be.undefined;
        persistenceMock.verify();
        queueMock.verify();
        done();
      });
    });
  });

  describe('reduceTeams', done => {
    let persistenceMock;
    let queueMock;

    beforeEach(() => {
      nock('http://stats.ncaa.org/').get(/\/player\/game_by_game.*/).reply(200, fixtures.gameByGame);

      persistenceMock = sinon.mock(persistence);

      persistenceMock.expects('set')
        .exactly(1)
        .returns(Promise.resolve());

      let mockMessages = [
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

      queueMock
        .expects('receiveMessages')
        .exactly(1)
        .returns(Promise.resolve(mockMessages));

      queueMock
        .expects('deleteMessage')
        .returns(Promise.resolve());
    });

    afterEach(() => {
      persistenceMock.restore();
      queueMock.restore();
    });

    it('should persist the divisions, add teams to the queue, and return nothing', done => {
      handler.reduceTeams({}, {}, (error, result) => {
        if (error) {
          throw error;
        }
        expect(error).to.be.null;
        expect(result.done).to.be.false;
        persistenceMock.verify();
        queueMock.verify();
        done();
      });
    });
  });
});
