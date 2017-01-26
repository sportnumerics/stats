'use strict';

const schedule = require('../../schedule');
const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const nock = require('nock');
const fixtures = require('../fixtures');

describe('teams-integration', () => {
  describe('collect', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/\d+\/\d+/).reply(200, fixtures.schedule);

      sinon.mock(persistence)
        .expects('write')
        .withArgs('teams/721/schedule', fixtures.stringifyEquivalentTo(fixtures.expectedScheduleJson))
        .returns(Promise.resolve());
    });

    afterEach(() => {
      persistence.write.restore();
    });

    it('should return the team schedule', (done) => {
      schedule.collect(null, null, (error, schedule) => {
        expect(error).to.be.null;
        expect(JSON.stringify(schedule)).to.deep.equal(JSON.stringify(fixtures.expectedScheduleJson.schedule));
        done();
      });
    });
  });
});
