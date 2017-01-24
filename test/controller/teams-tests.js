'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/teams');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/teams');
const fixtures = require('../fixtures');

describe('teams-controller', () => {
  describe('collect', () => {
    beforeEach(() => {
      sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', '1')
        .returns(Promise.resolve(fixtures.teamList));

      sinon.mock(persistence)
        .expects('write')
        .withArgs('divs/1/teams', fixtures.expectedTeamsJson)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
      persistence.write.restore();
    });

    it('should get teams from service and write to persistent store', () => {
      let result = controller.collect('2016', '1');

      return expect(result).to.eventually.deep.equal(fixtures.expectedTeamsJson.teams);
    });
  });
});
