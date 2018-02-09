'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/teams');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/teams');
const fixtures = require('../fixtures');
const _ = require('lodash');

describe('teams-controller', () => {
  const year = '2016';

  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)

      serviceMock
        .expects('getHtmlFromNcaa')
        .withArgs(year, { id: 'm1', sport: 'mla' })
        .returns(Promise.resolve(fixtures.teamList));
    });

    afterEach(() => {
      serviceMock.restore();
    });

    it('should get teams from service', async () => {
      const result = await controller.collect(year, { id: 'm1', sport: 'mla' });

      expect(result).to.deep.equal(fixtures.expectedTeamsJson.teams);

      serviceMock.verify();
    });
  });

  describe('normalize', () => {
    it('should make sure each opponent has a matching id', async () => {
      const persistenceMock = sinon.mock(persistence);

      const divs = fixtures.expectedStoredDivisionsJson;

      const teams = [fixtures.expectedGameByGameJson];

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: sinon.match.array,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs('MockResultsTable', { id: sinon.match.string, year }, teamMatch)
        .exactly(1)
        .returns(Promise.resolve());

      await controller.normalize({ year, divs, teams });

      persistenceMock.verify();
      persistenceMock.restore();
    });

    it('should not normalize teams without a schedule', async () => {
      const persistenceMock = sinon.mock(persistence);

      const divs = fixtures.expectedStoredDivisionsJson;

      const teamWithoutSchedule = _.omit(fixtures.expectedGameByGameJson, 'schedule');

      const teams = [teamWithoutSchedule];

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: undefined,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs('MockResultsTable', { id: sinon.match.string, year }, teamMatch)
        .exactly(1)
        .returns(Promise.resolve());

      await controller.normalize({ year, divs, teams });

      persistenceMock.verify();
      persistenceMock.restore();
    });
  });
});
