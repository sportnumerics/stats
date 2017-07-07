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
      let htmlPromise = gameByGameService.getHtmlFromNcaa('2016', 'm1', 721);

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });
});
