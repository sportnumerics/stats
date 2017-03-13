'use strict';

let fixtures = require('../fixtures.js'),
  gameByGameHtmlToJson = require('../../lib/adapter/game-by-game-html-to-json'),
  moment = require('moment');

describe('schedule html to json', () => {
  var data;
  beforeEach(() => {
    data = gameByGameHtmlToJson(fixtures.gameByGame);
  });

  it('should extract all the games', () => {
    expect(data.length).to.equal(20);
  });

  it('should extract each game date', () => {
    expect(data[0].date).to.be.sameMoment(moment.utc('02/20/2016', 'MM/DD/YYYY'));
  });

  it('should extract each opponent', () => {
    expect(data[0].opponent.id).to.equal(19651);
    expect(data[0].opponent.name).to.equal('High Point');
    expect(data[0].location.type).to.equal('home');
  });

  it('should extract each result', () => {
    expect(data[0].result.pointsFor).to.equal(15);
    expect(data[0].result.pointsAgainst).to.equal(10);
  });
});
