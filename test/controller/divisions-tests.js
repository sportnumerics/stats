'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence');
const controller = require('../../lib/controller/divisions');
const fixtures = require('../fixtures');

describe('divisions-controller', () => {
  describe('collect', () => {
    let persistenceMock;

    beforeEach(() => {
      let divisionMatch = sinon.match({
        sport: sinon.match.string,
        title: sinon.match.string
      })
      
      persistenceMock = sinon.mock(persistence);

      persistenceMock
        .expects('set')
        .exactly(6)
        .withArgs('MockDivisionsTable', { id: sinon.match.string, year: '2016' }, divisionMatch)
        .returns(Promise.resolve());
    });

    afterEach(() => {
      persistenceMock.restore();
    });

    it('should write divisions to persistent store', () => {
      return controller.collect('2016')
        .then(result => {
          expect(result).to.deep.equal(fixtures.expectedQueryDivisionsJson);
          persistenceMock.verify();
        });
    });
  });
});
