'use strict';

const teams = require('../../teams');
const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');

let nock = require('nock'),
  fixtures = require('../fixtures');

describe('teams-integration', () => {
  describe('collect', () => {
    beforeEach(() => {
      nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);

      sinon.mock(persistence)
        .expects('write')
        .withArgs('divs/1/teams', fixtures.expectedTeamsJson)
        .returns(Promise.resolve());
    });

    it('should return the list of teams', (done) => {
      teams.collect(null, null, (error, teams) => {
        expect(error).to.be.null;
        expect(teams).to.deep.equal(fixtures.expectedTeamsJson.teams);
        done();
      });
    });
  });
});
