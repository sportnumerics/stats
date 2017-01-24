'use strict';

let nock = require('nock'),
  fixtures = require('../fixtures'),
  teamsService = require('../../lib/service/teams'),
  getScheduleHTMLFromNcaa = require('../../lib/service/get-schedule-html-from-ncaa');

describe('teams-service', () => {
  describe('getHtmlFromNcaa', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);
    });

    it('should return an html document', () => {
      let htmlPromise = teamsService.getHtmlFromNcaa();

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });

  describe('getScheduleHTMLFromNcaa', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/\d+\/\d+/).reply(200, fixtures.schedule);
    });

    it('should return an html document', () => {
      let htmlPromise = getScheduleHTMLFromNcaa(721);

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });
});
