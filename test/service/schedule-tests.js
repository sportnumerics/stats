'use strict';

const nock = require('nock');
const fixtures = require('../fixtures');
const teamsService = require('../../lib/service/teams');
const scheduleService = require('../../lib/service/schedule');

describe('schedule-service', () => {
  describe('getHTMLFromNcaa', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/\d+\/\d+/).reply(200, fixtures.schedule);
    });

    it('should return an html document', () => {
      let htmlPromise = scheduleService.getHtmlFromNcaa(721);

      return expect(htmlPromise).to.eventually.be.a('string');
    });
  });
});
