'use strict';

let nock = require('nock'),
  fixtures = require('../fixtures'),
  teamsService = require('../../lib/service/teams'),
  sinon = require('sinon');

describe('teams-service', () => {
  describe('getHtmlFromNcaa', () => {
    describe('when things go well', () => {
      beforeEach(() => {
        nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);
      });

      afterEach(nock.cleanAll);

      it('should return an html document', () => {
        let htmlPromise = teamsService.getHtmlFromNcaa('2016', fixtures.womensDivision1);

        return expect(htmlPromise).to.eventually.be.a('string');
      });
    })

    describe('when things dont go well', () => {
      it('should timeout in  seconds if the response is not returned in time', async () => {
        let clock = sinon.useFakeTimers();

        nock('http://stats.ncaa.org')
          .get(/\/team\/inst_team_list.*/)
          .delayConnection(20000)
          .reply(200, fixtures.teamList);

        let htmlPromise = teamsService.getHtmlFromNcaa('2016', fixtures.womensDivision1);

        clock.tick(20000);

        await expect(htmlPromise).to.eventually.be.rejected;

        nock.cleanAll();
        clock.restore();
      });
    });
  });

  describe('getHtmlFromMcla', () => {
    describe('when things go well', () => {
      beforeEach(() => {
        nock('http://mcla.us').get(/\/teams\/2016/).reply(200, fixtures.mclaTeamList);
      });

      afterEach(nock.cleanAll);

      it('should return an html document', () => {
        let htmlPromise = teamsService.getHtmlFromMcla('2016', {});

        return expect(htmlPromise).to.eventually.be.a('string');
      });
    })

    describe('when things dont go well', () => {
      it('should timeout in  seconds if the response is not returned in time', async () => {
        let clock = sinon.useFakeTimers();

        nock('http://mcla.us')
          .get(/\/teams\/2016/)
          .delayConnection(20000)
          .reply(200, fixtures.teamList);

        let htmlPromise = teamsService.getHtmlFromMcla('2016', fixtures.womensDivision1);

        clock.tick(20000);

        await expect(htmlPromise).to.eventually.be.rejected;

        nock.cleanAll();
        clock.restore();
      });
    });
  });
});
