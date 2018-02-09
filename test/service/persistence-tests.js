'use strict';

const dynamodb = require('../../lib/service/dynamodb');
const persistence = require('../../lib/service/persistence');
const sinon = require('sinon');

describe('persistence-service', () => {
  function setUpMockWithExpectedParams(fname, expectedParams, returnValue = undefined) {
    const mockDb = sinon.mock(dynamodb);

    mockDb
      .expects(fname)
      .withArgs(expectedParams)
      .returns(Promise.resolve(returnValue));

    return mockDb;
  }

  describe('set', () => {
    it('should correctly interpolate parameter names', async () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: sinon.match(item => /set mockItemKey = :p\d+/.test(item)),
        ExpressionAttributeValues: sinon.match(item => (
          /:p/.test(Object.keys(item)[0]) && Object.values(item)[0] === 'mockItemValue'
        ))
      });

      const mockDb = setUpMockWithExpectedParams('updateAsync', expectedParams);

      await persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockItemKey': 'mockItemValue' })

      mockDb.restore();
    });

    it('should correctly extract reserved keys as expression attributes', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: sinon.match.string,
        ExpressionAttributeValues: sinon.match.object,
        ExpressionAttributeNames: sinon.match.object
      })

      const mockDb = setUpMockWithExpectedParams('updateAsync', expectedParams);

      return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'name': 'mockItemValue' })
        .finally(() => {
          mockDb.verify();
        });
    });

    it('should filter redundant in the object that are part of the key', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: sinon.match.string,
        ExpressionAttributeValues: sinon.match.object
      });

      const mockDb = setUpMockWithExpectedParams('updateAsync', expectedParams);

      return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockKeyName': 'mockKeyValue', 'mockItemKey': 'mockItemValue' })
        .finally(() => {
          mockDb.verify();
        });
    });

    it('should throw an error on non-redundant items in the key and in the update expression', () => {
      const stub = sinon.stub(dynamodb, 'updateAsync')

      stub.returns(new Promise.resolve());

      const promise = Promise.resolve()
        .then(() => persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockKeyName': 'nonRedundantValue', 'mockItemKey': 'mockItemValue' }));

      return expect(promise).to.be.rejectedWith('Cannot specify a different value for key in key and object to update')
        .then(() => {
          stub.restore();
        })
        .catch(() => {
          stub.restore();
        })
    });
  });

  describe('get', () => {
    it('should correctly interpolate parameter names', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        IndexName: 'mock-index',
        KeyConditionExpression: sinon.match.string,
        ExpressionAttributeValues: sinon.match.object
      });

      const mockDb = setUpMockWithExpectedParams('queryAsync', expectedParams, { Items: [
        {
          'mockKeyName': 'mockKeyValue',
          'mockOtherKey': 'mockOtherValue'
        }
      ]});

      return persistence.get('mock-table', { 'mockKeyName': 'mockKeyValue' }, { index: 'mock-index' })
        .then(result => {
          expect(result).to.deep.equal([{
            'mockKeyName': 'mockKeyValue',
            'mockOtherKey': 'mockOtherValue'
          }]);
        }).finally(() => {
          mockDb.verify();
        });
    });

    it('should correctly escape reserved keyword parameter names', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        IndexName: 'mock-index',
        KeyConditionExpression: sinon.match.string,
        ExpressionAttributeValues: sinon.match.object,
        ExpressionAttributeNames: sinon.match.object
      });

      const mockDb = setUpMockWithExpectedParams('queryAsync', expectedParams, { Items: [
        {
          'name': 'mockKeyValue',
          'mockOtherKey': 'mockOtherValue'
        }
      ]});

      return persistence.get('mock-table', { 'name': 'mockKeyValue' }, { index: 'mock-index' })
        .then(result => {
          expect(result).to.deep.equal([{
            'name': 'mockKeyValue',
            'mockOtherKey': 'mockOtherValue'
          }]);
        }).finally(() => {
          mockDb.verify();
        });
    });

    it('should keep getting if there are more values available', () => {
      const mockDb = sinon.mock(dynamodb);

      mockDb.expects('queryAsync')
        .withArgs(sinon.match({
          TableName: 'mock-table',
          KeyConditionExpression: sinon.match.string,
          ExpressionAttributeValues: sinon.match.object
        }))
        .returns(Promise.resolve({
          Items: [
            {
              'mockKey':'mockValue',
              'other': 'item1'
            }
          ],
          LastEvaluatedKey: {
            'foo': 'bar'
          }
        }));

      mockDb.expects('queryAsync')
        .withArgs(sinon.match({
          TableName: 'mock-table',
          KeyConditionExpression: sinon.match.string,
          ExpressionAttributeValues: sinon.match.object,
          ExclusiveStartKey: sinon.match.object
        }))
        .returns(Promise.resolve({
          Items: [
            {
              'mockKey': 'mockValue',
              'other': 'item2'
            }
          ]
        }));

        return persistence.get('mock-table', { 'mockKey': 'mockValue' })
          .then(result => {
            expect(result).to.deep.equal([
              {
                'mockKey':'mockValue',
                'other': 'item1'
              },
              {
                'mockKey': 'mockValue',
                'other': 'item2'
              }
            ]);
          }).finally(() => {
            mockDb.verify();
          });
    });
  });
});
