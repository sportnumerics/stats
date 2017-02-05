// 'use strict';
//
// const teams = require('../../teams');
// const sinon = require('sinon');
// const persistence = require('../../lib/service/persistence');
// const nock = require('nock');
// const fixtures = require('../fixtures');
//
// describe.skip('teams-integration', () => {
//   describe('collect', () => {
//     beforeEach(() => {
//       nock('http://stats.ncaa.org').get(/\/team\/inst_team_list.*/).reply(200, fixtures.teamList);
//
//       sinon.mock(persistence)
//         .expects('write')
//         .withArgs('divs/1/teams', fixtures.expectedTeamsJson)
//         .returns(Promise.resolve());
//     });
//
//     afterEach(() => {
//       persistence.write.restore();
//     });
//
//     it('should return the list of teams', (done) => {
//       teams.collect(null, null, (error, teams) => {
//         expect(error).to.be.null;
//         expect(teams).to.deep.equal(fixtures.expectedTeamsJson.teams);
//         done();
//       });
//     });
//   });
// });
