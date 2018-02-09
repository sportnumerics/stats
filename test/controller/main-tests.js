const sinon = require('sinon');
const divisions = require('../../lib/controller/divisions');
const teams = require('../../lib/controller/teams');
const schedule = require('../../lib/controller/schedule');
const main = require('../../lib/controller/main');
const fixtures = require('../fixtures');

describe('main-controller', () => {
  describe('collect', () => {
    let mockTeams, mockDivisions, mockSchedule;
    const year = '2016';

    beforeEach(() => {
      mockDivisions = sinon.mock(divisions);

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

      mockTeams
        .expects('normalize')
        .withArgs({ year, divs: [mockDivision], teams: [fixtures.expectedGameByGameJson] })
        .returns(Promise.resolve());

      mockSchedule = sinon.mock(schedule);

      mockSchedule
        .expects('collect')
        .withArgs(mockTeam)
        .returns(Promise.resolve(fixtures.expectedGameByGameJson));
    });

    afterEach(() => {
      mockDivisions.restore();
      mockTeams.restore();
      mockSchedule.restore();
    });

    it('should use collect the divisions from the divisions controller', async () => {
      await main.collect({ year });

      mockDivisions.verify();
    });

    it('should use the divisions to collect the teams and normalize', async () => {
      await main.collect({ year });

      mockTeams.verify();
    });

    it('should use the schedules to collect the schedules', async () => {
      await main.collect({ year });

      mockSchedule.verify();
    });
  })
})
