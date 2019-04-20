const nock = require('nock');
const sinon = require('sinon');
const fixtures = require('../fixtures');
const { collect } = require('../../lib/controller/main');
const persistence = require('../../lib/service/persistence-s3');
const predict = require('../../lib/service/predict');

describe('integration', () => {
  describe('main', () => {
    it.skip('should collect one team for each division', async () => {
      nock('http://stats.ncaa.org')
        .get(/\/team\/inst_team_list.*/)
        .times(6)
        .reply(200, fixtures.teamList);
      nock('http://mcla.us')
        .get(/\/teams\/\d+/)
        .times(2)
        .reply(200, fixtures.mclaTeamList);
      nock('http://stats.ncaa.org/')
        .get(/\/player\/game_by_game.*/)
        .times(6)
        .reply(200, fixtures.gameByGame);
      nock('http://mcla.us/team/')
        .get(/[^\/]+\/\d+\/schedule.html/)
        .times(2)
        .reply(200, fixtures.alabamaGameByGame);

      let persistenceMock = sinon.mock(persistence);

      persistenceMock
        .expects('set')
        .withArgs(
          'MockResultsBucket',
          sinon.match(/\d{4}\/divisions\.json/),
          fixtures.expectedStoredDivisionsJson
        )
        .exactly(1)
        .resolves();

      let teamMatch = sinon.match({
        id: sinon.match.string,
        schedule: sinon.match.array,
        name: sinon.match.string,
        div: sinon.match.string
      });

      persistenceMock
        .expects('set')
        .withArgs(
          'MockResultsBucket',
          sinon.match(/\d{4}\/teams\/\w+\-[\d\w\-]+\.json/),
          teamMatch
        )
        .exactly(8)
        .resolves();

      let predictMock = sinon.mock(predict);

      predictMock
        .expects('initiate')
        .withArgs(sinon.match.string)
        .resolves();

      await collect({ year: '2018' }, { maxTeamCount: 1 });

      persistenceMock.verify();
      persistenceMock.restore();

      predictMock.verify();
      predictMock.restore();
    });
  });
});
