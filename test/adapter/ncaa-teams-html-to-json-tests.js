'use strict';

let fixtures = require('../fixtures.js'),
  teamsHtmlToJson = require('../../lib/adapter/ncaa-teams-html-to-json');

describe('ncaa teams html to json', () => {
  var data;
  beforeEach(() => {
    data = teamsHtmlToJson({ div: 'm1', sport: 'mla' })(fixtures.teamList);
  });

  it('should extract all the teams', () => {
      expect(data.length).to.equal(69);
  });

  it('should extract each team name', () => {
    expect(data[0].name).to.equal('Air Force');
    expect(data[68].name).to.equal('Yale');
  });

  it('should extract each team slug', () => {
    expect(data[0].id).to.equal('mla-721');
  });
});
