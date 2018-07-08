'use strict';

const sinon = require('sinon');
const persistence = require('../../lib/service/persistence-s3');
const controller = require('../../lib/controller/divisions');
const fixtures = require('../fixtures');

describe('divisions-controller', () => {
  describe('collect', () => {
    let persistenceMock;

    beforeEach(() => {
      persistenceMock = sinon.mock(persistence);

      persistenceMock
        .expects('set')
        .exactly(1)
        .withArgs('MockResultsBucket', sinon.match(/2016\/divisions/), fixtures.expectedStoredDivisionsJson)
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
