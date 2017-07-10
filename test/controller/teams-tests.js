'use strict';

const sinon = require('sinon');
const service = require('../../lib/service/teams');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/teams');
const fixtures = require('../fixtures');

describe('teams-controller', () => {
  describe('collect', () => {
    let serviceMock;

    beforeEach(() => {
      serviceMock = sinon.mock(service)
        .expects('getHtmlFromNcaa')
        .withArgs('2016', { id: 'm1', sport: 'mla' })
        .returns(Promise.resolve(fixtures.teamList));
    });

    afterEach(() => {
      service.getHtmlFromNcaa.restore();
    });

    it('should get teams from service', () => {
      return controller.collect('2016', { id: 'm1', sport: 'mla' })
        .then(result => {
          expect(result).to.deep.equal(fixtures.expectedTeamsJson.teams);

          serviceMock.verify();
        });
    });
  });

  describe('normalize', () => {
    it('should make sure each opponent has a matching id', () => {
      let persistenceMock = sinon.mock(persistence);

      persistenceMock
        .expects('get')
        .withArgs('MockDivisionsTable', { year: '2016' })
        .returns(Promise.resolve(fixtures.expectedStoredDivisionsJson))

      persistenceMock
        .expects('get')
        .withArgs('MockResultsTable', { year: '2016' })
        .returns(Promise.resolve([fixtures.expectedGameByGameJson]));

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: sinon.match.array,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs('MockResultsTable', { id: sinon.match.string, year: '2016' }, teamMatch)
        .exactly(1)
        .returns(Promise.resolve());

      return controller.normalize('2016')
        .then(() => {
          persistenceMock.verify();
          persistenceMock.restore();
        });
    });

    it('should not normalize teams without a schedule', () => {
      let persistenceMock = sinon.mock(persistence);

      persistenceMock
        .expects('get')
        .withArgs('MockDivisionsTable', { year: '2016' })
        .returns(Promise.resolve(fixtures.expectedStoredDivisionsJson))

      let teamWithoutSchedule = fixtures.expectedGameByGameJson;
      teamWithoutSchedule.schedule = undefined;

      persistenceMock
        .expects('get')
        .withArgs('MockResultsTable', { year: '2016' })
        .returns(Promise.resolve([teamWithoutSchedule]));

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: undefined,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs('MockResultsTable', { id: sinon.match.string, year: '2016' }, teamMatch)
        .exactly(1)
        .returns(Promise.resolve());

      return controller.normalize('2016')
        .then(() => {
          persistenceMock.verify();
          persistenceMock.restore();
        });
    });
  });
});
