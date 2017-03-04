'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/divisions');
const fixtures = require('../fixtures');

describe('divisions-controller', () => {
  describe('collect', () => {
    beforeEach(() => {
      sinon.mock(persistence)
        .expects('write')
        .withArgs('years/2016/divs', fixtures.expectedDivisionsJson)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      persistence.write.restore();
    });

    it('should write divisions to persistent store', () => {
      let result = controller.collect('2016');

      return expect(result).to.eventually.deep.equal(fixtures.expectedDivisionsJson.divisions);
    });
  });
});
