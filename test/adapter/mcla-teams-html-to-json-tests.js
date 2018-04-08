'use strict';

let fixtures = require('../fixtures.js'),
  teamsHtmlToJson = require('../../lib/adapter/mcla-teams-html-to-json');

describe('mcla teams html to json', () => {
  var data;
  beforeEach(() => {
    data = teamsHtmlToJson({ div: 'm1', sport: 'mla', source: { type: 'mcla', id: '1' } })(fixtures.mclaTeamList);
  });

  it('should extract all the teams', () => {
      expect(data.length).to.equal(85);
  });

  it('should extract each team name', () => {
    expect(data[0].name).to.equal('Alabama');
    expect(data[84].name).to.equal('Western Michigan');
  });

  it('should extract each team slug', () => {
    expect(data[0].id).to.equal('mla-alabama');
  });

  it('should extract team slugs and change underscores to dashes', () => {
    expect(data[2].id).to.equal('mla-arizona-state');
  })
});
