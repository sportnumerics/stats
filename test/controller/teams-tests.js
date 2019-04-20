'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/teams');
const persistence = require('../../lib/service/persistence-s3');
const controller = require('../../lib/controller/teams');
const fixtures = require('../fixtures');
const _ = require('lodash');

describe('teams-controller', () => {
  const year = '2016';

  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service);
    });

    afterEach(() => {
      serviceMock.restore();
    });

    it('should get ncaa teams from ncaa', async () => {
      serviceMock
        .expects('getHtmlFromNcaa')
        .withArgs(year, { id: 'm1', sport: 'mla', source: { type: 'ncaa' } })
        .resolves(fixtures.teamList);

      const result = await controller.collect(year, {
        id: 'm1',
        sport: 'mla',
        source: {
          type: 'ncaa'
        }
      });

      expect(result).to.deep.equal(fixtures.expectedTeamsJson.teams);

      serviceMock.verify();
    });

    it('should get mcla teams from mcla', async () => {
      serviceMock
        .expects('getHtmlFromMcla')
        .withArgs(year, {
          id: 'mcla1',
          sport: 'mla',
          source: { type: 'mcla', id: '1' }
        })
        .resolves(fixtures.mclaTeamList);

      const result = await controller.collect(year, {
        id: 'mcla1',
        sport: 'mla',
        source: {
          type: 'mcla',
          id: '1'
        }
      });

      require('fs').writeFileSync('teams.json', JSON.stringify(result));

      expect(result).to.deep.equal(fixtures.expectedMclaTeamsJson.teams);

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
        .withArgs('MockResultsBucket', `2016/teams/mla-721.json`, teamMatch)
        .exactly(1)
        .resolves();

      await controller.normalize({ year, divs, teams });

      persistenceMock.verify();
      persistenceMock.restore();
    });

    it('should not normalize teams without a schedule', async () => {
      const persistenceMock = sinon.mock(persistence);

      const divs = fixtures.expectedStoredDivisionsJson;

      const teamWithoutSchedule = _.omit(
        fixtures.expectedGameByGameJson,
        'schedule'
      );

      const teams = [teamWithoutSchedule];

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: undefined,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs('MockResultsBucket', `2016/teams/mla-721.json`, teamMatch)
        .exactly(1)
        .resolves();

      await controller.normalize({ year, divs, teams });

      persistenceMock.verify();
      persistenceMock.restore();
    });
  });
});
