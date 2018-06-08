'use strict';

const S3 = require('../../lib/service/s3');
const persistence = require('../../lib/service/persistence-s3');
const sinon = require('sinon');

describe('persistence-s3-service', () => {
  function setUpMockWithExpectedParams(fname, expectedParams, returnValue = undefined) {
    const mockS3 = sinon.mock(S3);

    mockS3
      .expects(fname)
      .withArgs(expectedParams)
      .returns(Promise.resolve(returnValue));

    return mockS3;
  }

  describe('get', () => {
    it('should return the object from s3', async () => {
      const mockS3 = setUpMockWithExpectedParams('getObject', sinon.match({
        Bucket: 'test-bucket',
        Key: 'test-key.json'
      }), {
        Body: 'test data response'
      });

      const response = await persistence.get('test-bucket', 'test-key.json');

      expect(response.Body).to.equal('test data response');

      mockS3.restore();
    });
  });

  describe('set', () => {
    it('should set the relevant bucket key', async () => {
      const mockS3 = setUpMockWithExpectedParams('putObject', sinon.match({
        Bucket: 'test-bucket',
        Key: 'test-key.json',
        Body: 'test data object',
        ContentType: 'mock/content-type'
      }), {
        Mock: 'Response'
      });

      const response = await persistence.set('test-bucket', 'test-key.json', 'test data object');

      expect(response.Mock).to.equal('Response');
    });
  })
});