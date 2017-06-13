'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/divisions');
const fixtures = require('../fixtures');

describe('divisions-controller', () => {
  describe('collect', () => {
    beforeEach(() => {
      sinon.mock(persistence)
        .expects('set')
        .withArgs('MockDivisionsTable', {season:'2016'}, fixtures.expectedDivisionsJson)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      persistence.set.restore();
    });

    it('should write divisions to persistent store', () => {
      return controller.collect('2016')
        .then(result => {
          expect(result).to.deep.equal(fixtures.expectedDivisionsJson.divisions);
        });
    });
  });
});
