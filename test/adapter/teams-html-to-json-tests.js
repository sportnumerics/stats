'use strict';

let fixtures = require('../fixtures.js'),
  teamsHtmlToJson = require('../../lib/adapter/teams-html-to-json');

let expect = fixtures.expect;

describe('teams html to json', () => {
  var data;
  beforeEach(() => {
    data = teamsHtmlToJson(fixtures.teamList);
  });

  it('should extract all the teams', () => {
      expect(data.length).to.equal(69);
  });

  it('should extract each team name', () => {
    expect(data[0].name).to.equal('Air Force');
    expect(data[68].name).to.equal('Yale');
  });

  it('should extract each team slug', () => {
    expect(data[0].id).to.equal(721);
  });
});
