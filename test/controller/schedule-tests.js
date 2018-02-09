'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/schedule');
const service = controller.service;
const fixtures = require('../fixtures');

describe('schedule-controller', () => {
  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)

      serviceMock
        .expects('getHtmlFromNcaa')
        .withArgs('2016', 'm1', 'mla-721')
        .returns(Promise.resolve(fixtures.gameByGame))

      let expectedTeam = sinon.match({
        id: 'mla-721',
        name: 'Air Force',
        div: 'm1',
        year: '2016',
        schedule: sinon.match.array
      });
    });

    afterEach(() => {
      serviceMock.restore();
    });

    it('should get team schedule from service and write to persistent store', async () => {
      const schedule = await controller.collect({ id: 'mla-721', name: 'Air Force', div: 'm1', year: '2016' });

      expect(schedule).to.deep.equal(fixtures.expectedGameByGameJson);
      serviceMock.verify();
    });
  });
});
