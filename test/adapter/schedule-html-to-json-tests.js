'use strict';

let fixtures = require('../fixtures.js'),
  scheduleHtmlToJson = require('../../lib/adapter/schedule-html-to-json'),
  moment = require('moment');

describe('schedule html to json', () => {
  var data;
  beforeEach(() => {
    data = scheduleHtmlToJson(fixtures.schedule);
  });

  it('should extract all the games', () => {
    expect(data.length).to.equal(16);
  });

  it('should extract each game date', () => {
    expect(data[0].date).to.be.sameMoment(moment.utc('02/06/2016', 'MM/DD/YYYY'));
  });

  it('should extract each opponent', () => {
    expect(data[0].opponent.id).to.equal(726);
    expect(data[0].opponent.name).to.equal('Navy');
    expect(data[0].location.type).to.equal('away');
  });

  it('should extract each result', () => {
    expect(data[0].result.pointsFor).to.equal(6);
    expect(data[0].result.pointsAgainst).to.equal(10);
  });
});
