const sinon = require('sinon');
const divisions = require('../../lib/controller/divisions');
const teams = require('../../lib/controller/teams');
const schedule = require('../../lib/controller/schedule');
const predict = require('../../lib/service/predict');
const main = require('../../lib/controller/main');
const fixtures = require('../fixtures');

describe('main-controller', () => {
  describe('collect', () => {
    let mockTeams, mockDivisions, mockSchedule;
    let scheduleCollectMock, normalizeMock;
    const year = '2016';
    const mockDivision = {
      'id': 'm1',
      'sport': 'mla',
      'source': {
        'type': 'ncaa',
        'id': '1',
        'sportCode': 'MLA'
      },
      'title': 'NCAA Men\'s Division 1'
    };

    beforeEach(() => {
      mockDivisions = sinon.mock(divisions);

      mockDivisions
        .expects('collect')
        .withArgs(year)
        .returns(Promise.resolve([mockDivision]));

      mockTeams = sinon.mock(teams);

      const mockTeam = {
        instCode: '14',
        name: 'Albany (NY)',
        year: '2016',
        div: 'm1',
        sport: 'mla',
        id: 'mla-14'
      };

      mockTeams
        .expects('collect')
        .withArgs(year, mockDivision)
        .returns(Promise.resolve([mockTeam]));

      mockSchedule = sinon.mock(schedule);

      scheduleCollectMock = mockSchedule
        .expects('collect')
        .withArgs(mockTeam);

      scheduleCollectMock
        .returns(Promise.resolve(fixtures.expectedGameByGameJson));

      normalizeMock = mockTeams
        .expects('normalize');

      normalizeMock
        .withArgs({ year, divs: [mockDivision], teams: [fixtures.expectedGameByGameJson] })
        .returns(Promise.resolve());

      mockPredict = sinon.mock(predict);

      mockPredict
        .expects('initiate')
        .withArgs(year)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      mockDivisions.restore();
      mockTeams.restore();
      mockSchedule.restore();
      mockPredict.restore();
    });

    it('should use collect all the team schedules using the divisions and teams controllers', async () => {
      await main.collect({ year });

      mockDivisions.verify();
      mockTeams.verify();
      mockSchedule.verify();
      mockPredict.verify();
    });

    it('should not fail completely if one of the schedules does not get returned', async () => {
      scheduleCollectMock
        .throws(new Error('mock error'));
      
      normalizeMock
        .withArgs({ year, divs: [mockDivision], teams: [] })
        .returns(Promise.resolve());

      await main.collect({ year });

      mockDivisions.verify();
      mockTeams.verify();
      mockSchedule.verify();
      mockPredict.verify();
    });
  });
});
