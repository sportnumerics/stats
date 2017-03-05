'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/schedule');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/schedule');
const fixtures = require('../fixtures');

describe('schedule-controller', () => {
  describe('collect', () => {
    beforeEach(() => {
      sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', '721')
        .returns(Promise.resolve(fixtures.schedule));

      sinon.mock(persistence)
        .expects('write')
        .withArgs('years/2016/teams/721/schedule', fixtures.stringifyEquivalentTo(fixtures.expectedScheduleJson))
        .returns(Promise.resolve());
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
      persistence.write.restore();
    });

    it('should get team schedule from service and write to persistent store', (done) => {
      controller.collect('2016', '721', fixtures.expectedTeamsJson.teams)
        .then((result) => {
          expect(JSON.stringify(result)).to.deep.equal(JSON.stringify(fixtures.expectedScheduleJson.schedule));
          done();
        })
        .catch((error) => {
          done(error);
        });

      return
    });
  });
});
