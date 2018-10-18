'use strict';

const fixtures = require('../fixtures.js'),
  dateChecker = require('../../lib/adapter/date-checker'),
  moment = require('moment');

describe('date-checker', () => {
  it('should return true for months between January and May (inclusive)', () => {
    const date = moment('2018-02-02');

    expect(dateChecker.shouldRefreshStatsGivenMoment(date)).to.be.true;
  });

  it('should return false for dates after May', () => {
    const date = moment('2018-06-01');

    expect(dateChecker.shouldRefreshStatsGivenMoment(date)).to.be.false;
  })
});