'use strict';

let fixtures = require('../fixtures.js'),
  normalizeTeam = require('../../lib/adapter/normalize-team');

describe('normalizeTeam', () => {
  it('should add the correct opponent id for each opponent in the schedule', () => {
    let teams = fixtures.expectedTeamsJson.teams;
    let divs = fixtures.expectedStoredDivisionsJson;
    let team = fixtures.expectedGameByGameJson;

    expect(normalizeTeam(teams, divs)(team)).to.deep.equal(fixtures.expectedNormalizedGameByGameJson);
  });
});
