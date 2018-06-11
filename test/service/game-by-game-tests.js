'use strict';

const nock = require('nock');
const fixtures = require('../fixtures');
const teamsService = require('../../lib/service/teams');
const gameByGameService = require('../../lib/service/game-by-game');

describe('game-by-game-service', () => {
  describe('getHTMLFromNcaa', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org/').get(/\/player\/game_by_game.*/).reply(200, fixtures.gameByGame);
    });

    it('should return an html document', () => {
      let htmlPromise = gameByGameService.getHtmlFromNcaa('2016', {
        id: 'mla-721',
        sport: 'mla',
        instCode: '721'
      });

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });

  describe('getHtmlFromMcla', () => {
    it('should return an html document', async () => {
      nock('http://mcla.us/team/').get(/alabama\/2018\/schedule.html/).reply(200, fixtures.alabamaGameByGame);

      const html = await gameByGameService.getHtmlFromMcla('2018', {
        id: 'mla-alabama',
        sport: 'mla',
        instCode: 'alabama'
      });

      expect(html).to.be.a.string;

      nock.cleanAll();
    });

    it('should use the instCode for fetching the team', async () => {
      nock('http://mcla.us/team/').get(/alabama_state\/2018\/schedule.html/).reply(200, fixtures.alabamaGameByGame);

      const html = await gameByGameService.getHtmlFromMcla('2018', {
        id: 'mla-alabama-state',
        sport: 'mla',
        instCode: 'alabama_state'
      });

      expect(html).to.be.a.string;

      nock.cleanAll();
    })
  });
});
