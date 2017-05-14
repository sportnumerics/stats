'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/schedule');
const service = controller.service;
const fixtures = require('../fixtures');

describe('schedule-controller', () => {
  describe('collect', () => {
    beforeEach(() => {
      sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', 721)
        .returns(Promise.resolve(fixtures.gameByGame))

      sinon.mock(persistence)
        .expects('set')
        .withArgs('MockResultsTable', { id: '721', year: '2016' }, fixtures.stringifyEquivalentTo(fixtures.expectedGameByGameJson))
        .returns(Promise.resolve())
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
      persistence.set.restore();
    });

    it('should get team schedule from service and write to persistent store', () => {
      return controller.collect('2016', 721, fixtures.expectedTeamsJson.teams);
    });
  });
});
