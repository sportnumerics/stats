'use strict';

const orchestration = require('../../lib/controller/orchestration');
const persistence = require('../../lib/service/persistence');
const messaging = require('../../lib/service/messaging');
const sinon = require('sinon');
const nock = require('nock');
const fixtures = require('../fixtures');

describe('orchestration-integration', () => {
  describe('collectTeamsAndSchedules', () => {
    var publishMock;

    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);

      sinon.mock(persistence)
        .expects('write')
        .withArgs('years/2016/divs/1/teams', fixtures.stringifyEquivalentTo(fixtures.expectedTeamsJson))
        .returns(Promise.resolve());

      publishMock = sinon.mock(messaging)
        .expects('publishCollectSchedule')
        .withArgs('2016', sinon.match.number)
        .exactly(69)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      publishMock.verify();
      persistence.write.restore();
      messaging.publishCollectSchedule.restore();
    });

    it('should return the team schedule', () => {
      return expect(orchestration.collectTeamsAndSchedules('2016', '1')).to.be.fulfilled;
    });
  });

  describe('collectAll', () => {
    var publishMock;

    beforeEach(() => {
      sinon.mock(persistence)
        .expects('write')
        .withArgs('years/2016/divs', fixtures.stringifyEquivalentTo(fixtures.expectedDivisionsJson))
        .returns(Promise.resolve());

      publishMock = sinon.mock(messaging)
        .expects('publishCollectTeams')
        .withArgs('2016', sinon.match.string)
        .exactly(3)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      publishMock.verify();
      persistence.write.restore();
      messaging.publishCollectTeams.restore();
    });

    it('should return divisions', () => {
      return expect(orchestration.collectAll('2016')).to.be.fulfilled;
    });
  });
});
