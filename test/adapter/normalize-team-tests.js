'use strict';

let fixtures = require('../fixtures.js'),
  normalizeTeam = require('../../lib/adapter/normalize-team');

describe('normalizeTeam', () => {
  it('should add the correct opponent id for each opponent in the schedule for ncaa teams', () => {
    let teams = fixtures.expectedTeamsJson.teams;
    let divs = fixtures.expectedStoredDivisionsJson;
    let team = fixtures.expectedGameByGameJson;

    expect(normalizeTeam(teams, divs)(team)).to.deep.equal(
      fixtures.expectedNormalizedGameByGameJson
    );
  });

  it('should add the correct opponent id for each opponent in the schedule for mcla teams', () => {
    let teams = fixtures.expectedMclaTeamsJson.teams;
    let divs = fixtures.expectedStoredDivisionsJson;
    let team = fixtures.expectedMclaGameByGameJson;

    expect(normalizeTeam(teams, divs)(team)).to.deep.equal(
      fixtures.expectedNormalizedMclaGameByGameJson
    );
  });
});
