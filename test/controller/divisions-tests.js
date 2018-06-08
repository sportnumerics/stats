'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence-s3');
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
        .exactly(8)
        .withArgs('MockDivisionsBucket', sinon.match(/2016\/\w+\d+/), divisionMatch)
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
