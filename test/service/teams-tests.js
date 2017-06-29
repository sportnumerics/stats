'use strict';

let nock = require('nock'),
  fixtures = require('../fixtures'),
  teamsService = require('../../lib/service/teams');

describe('teams-service', () => {
  describe('getHtmlFromNcaa', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);
    });

    it('should return an html document', () => {
      let htmlPromise = teamsService.getHtmlFromNcaa('2016', fixtures.womensDivision1);

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });
});
