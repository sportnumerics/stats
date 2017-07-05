'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/schedule');
const service = controller.service;
const fixtures = require('../fixtures');

describe('schedule-controller', () => {
  describe('collect', () => {
    let serviceMock, persistenceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', '721')
        .returns(Promise.resolve(fixtures.gameByGame))

      persistenceMock = sinon.mock(persistence)
        .expects('set')
        .withArgs('MockResultsTable', { id: '721', year: '2016' }, fixtures.stringifyEquivalentTo(fixtures.expectedGameByGameJson))
        .returns(Promise.resolve())
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
      persistence.set.restore();
    });

    it('should get team schedule from service and write to persistent store', () => {
      return controller.collect({ id: '721', name: 'Air Force', div: 'm1', year: '2016' })
        .then(() => {
          serviceMock.verify();
          persistenceMock.verify();
        })
    });
  });
});
