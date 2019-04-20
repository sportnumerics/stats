'use strict';

const S3 = require('../../lib/service/s3');
const persistence = require('../../lib/service/persistence-s3');
const sinon = require('sinon');

describe('persistence-s3-service', () => {
  function setUpMockWithExpectedParams(
    fname,
    expectedParams,
    returnValue = undefined
  ) {
    const mockS3 = sinon.mock(S3);
    const promise = sinon.stub();

    promise.resolves(returnValue);

    mockS3
      .expects(fname)
      .withArgs(expectedParams)
      .returns({ promise });

    return mockS3;
  }

  describe('get', () => {
    it('should return the object from s3', async () => {
      const mockS3 = setUpMockWithExpectedParams(
        'getObject',
        sinon.match({
          Bucket: 'test-bucket',
          Key: 'test-key.json'
        }),
        {
          Body: '{"key":"value"}'
        }
      );

      const response = await persistence.get('test-bucket', 'test-key.json');

      expect(response.Body).to.deep.equal({ key: 'value' });

      mockS3.verify();
      mockS3.restore();
    });
  });

  describe('set', () => {
    it('should set the relevant bucket key', async () => {
      const mockS3 = setUpMockWithExpectedParams(
        'putObject',
        sinon.match({
          Bucket: 'test-bucket',
          Key: 'test-key.json',
          Body: '{"key":"value"}',
          ContentType: 'mock/content-type'
        }),
        {
          Mock: 'Response'
        }
      );

      const response = await persistence.set('test-bucket', 'test-key.json', {
        key: 'value'
      });

      expect(response.Mock).to.equal('Response');

      mockS3.verify();
      mockS3.restore();
    });

    it('should fail with an exception when set fails', async () => {
      const mockS3 = sinon.mock(S3);

      const promise = sinon.stub();

      promise.rejects(new Error('mock bucket error'));

      mockS3
        .expects('putObject')
        .withArgs(
          sinon.match({
            Key: 'test-key.json',
            Body: '{"key":"value"}',
            ContentType: 'mock/content-type'
          })
        )
        .returns({ promise });

      try {
        const response = await persistence.set(undefined, 'test-key.json', {
          key: 'value'
        });

        throw new Error('expected an error, got', response);
      } catch (error) {
        expect(error.message).to.equal('mock bucket error');

        mockS3.verify();
      } finally {
        mockS3.restore();
      }
    });
  });
});
