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

    it('should persist the divisions, add teams to the queue, and return the year in the payload', done => {
      handler.collectAllTeamsForReduction({ year: '2016' }, {}, (error, data) => {
        expect(error).to.be.null;
        expect(data.year).to.equal('2016');
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
            id: 'mla-721',
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
      handler.reduceTeams({
        year: '2016',
        failed: [{
          id: 'fail-123',
          error: 'mock error'
        }],
        successful: ['succ-123']
      }, {}, (error, result) => {
        if (error) {
          throw error;
        }
        expect(error).to.be.null;
        expect(result.done).to.be.false;
        expect(result.year).to.equal('2016');
        expect(result.failed).to.have.lengthOf(1);
        expect(result.successful).to.have.lengthOf(2);
        persistenceMock.verify();
        queueMock.verify();
        done();
      });
    });
  });
});
