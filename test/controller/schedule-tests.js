'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/schedule');
const service  = require('../../lib/service/game-by-game.js');
const fixtures = require('../fixtures');

describe('schedule-controller', () => {
  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)
    });

    afterEach(() => {
      serviceMock.restore();
    });

    it('should get ncaa team schedule from service and return it', async () => {
      serviceMock
        .expects('getHtmlFromNcaa')
        .withArgs('2016', 'mla-721')
        .returns(Promise.resolve(fixtures.gameByGame));

      const schedule = await controller.collect({
        id: 'mla-721',
        name: 'Air Force',
        div: 'm1',
        year: '2016',
        source: {
          type: 'ncaa'
        }
      });

      expect(schedule).to.deep.equal(fixtures.expectedGameByGameJson);
      serviceMock.verify();
    });

    it('should get mcla team schedule from service and return it', async () => {
      serviceMock
        .expects('getHtmlFromMcla')
        .withArgs('2018', 'mla-alabama')
        .returns(Promise.resolve(fixtures.alabamaGameByGame));

      const team = await controller.collect({
        id: 'mla-alabama',
        name: 'Alabama',
        div: 'mcla1',
        year :'2018',
        source: {
          type: 'mcla'
        }
      });

      expect(team.schedule).to.have.lengthOf(11);
      expect(team).to.deep.equal(fixtures.expectedMclaGameByGameJson);
      serviceMock.verify();
    });
  });
});
