'use strict';

const fixtures = require('../fixtures.js'),
  gameByGameHtmlToJson = require('../../lib/adapter/mcla-game-by-game-html-to-json'),
  moment = require('moment');

describe('mcla schedule html to json', () => {
  var data;
  beforeEach(() => {
    data = gameByGameHtmlToJson(fixtures.alabamaGameByGame, '2018');
  });

  it('should extract all the games', () => {
    expect(data.length).to.equal(11);
  });

  it('should extract each game date', () => {
    expect(data[0].date).to.be.sameMoment(moment.utc('02/03/2018 2:00pm', 'MM/DD/YYYY hh:mma'));
  });

  it('should extract each opponent', () => {
    expect(data[0].opponent.name).to.equal('Vanderbilt');
    expect(data[0].location.type).to.equal('away');
  });

  it('should extract each result', () => {
    expect(data[0].result.pointsFor).to.equal(9);
    expect(data[0].result.pointsAgainst).to.equal(6);
  });
});

describe('mcla 2016 schedule html to json', () => {
  let data;
  beforeEach(() => {
    data = gameByGameHtmlToJson(fixtures.alabama2016GameByGame, '2016');
  });

  it('should extract each game date', () => {
    expect(data[0].date).to.be.sameMoment(moment.utc('02/06/2016 12:00pm', 'MM/DD/YYYY hh:mma'));
  });
})
