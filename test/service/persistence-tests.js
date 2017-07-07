'use strict';

const dynamodb = require('../../lib/service/dynamodb');
const persistence = require('../../lib/service/persistence');
const sinon = require('sinon');

describe('persistence-service', () => {
  let mockDb;

  function setUpMockWithExpectedParams(fname, expectedParams, returnValue = undefined) {
    mockDb = sinon.mock(dynamodb);

    mockDb
      .expects(fname)
      .withArgs(expectedParams)
      .returns(Promise.resolve(returnValue));
  }

  function restoreMock() {
    mockDb.restore();
  }

  describe('set', () => {
    it('should correctly interpolate parameter names', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: 'set mockItemKey = :p1',
        ExpressionAttributeValues: {
          ':p1': 'mockItemValue'
        }
      });

      setUpMockWithExpectedParams('updateAsync', expectedParams);    

      return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockItemKey': 'mockItemValue' })
        .then(() => {
          mockDb.verify();
          restoreMock();
        });
    });

    it('should correctly extract reserved keys as expression attributes', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: 'set #token3 = :p2',
        ExpressionAttributeValues: {
          ':p2': 'mockItemValue'
        },
        ExpressionAttributeNames: {
          '#token3': 'name'
        }
      })

      setUpMockWithExpectedParams('updateAsync', expectedParams);

      return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'name': 'mockItemValue' })
        .then(() => {
          mockDb.verify();
          restoreMock();
        });
    });

    it('should filter redundant in the object that are part of the key', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        Key: { 'mockKeyName': 'mockKeyValue' },
        UpdateExpression: 'set mockItemKey = :p4',
        ExpressionAttributeValues: {
          ':p4': 'mockItemValue'
        }
      });

      setUpMockWithExpectedParams('updateAsync', expectedParams);

      return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockKeyName': 'mockKeyValue', 'mockItemKey': 'mockItemValue' })
        .then(() => {
          mockDb.verify();
          restoreMock();
        });
    });

    it('should throw an error on non-redundant items in the key and in the update expression', () => {
      const stub = sinon.stub(dynamodb, 'updateAsync').returns(new Promise.resolve());

      const persist = () => {
        return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockKeyName': 'nonRedundantValue', 'mockItemKey': 'mockItemValue' });
      };

      expect(persist).to.throw('Cannot specify a different value for key in key and object to update');

      dynamodb.updateAsync.restore();
    });
  });

  describe('get', () => {
    it('should correctly interpolate parameter names', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        IndexName: 'mock-index',
        KeyConditionExpression: 'mockKeyName = :p5',
        ExpressionAttributeValues: {
          ':p5': 'mockKeyValue'
        }
      });

      setUpMockWithExpectedParams('queryAsync', expectedParams, { Items: [
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
          restoreMock();
        });
    });

    it('should correctly escape reserved keyword parameter names', () => {
      let expectedParams = sinon.match({
        TableName: 'mock-table',
        IndexName: 'mock-index',
        KeyConditionExpression: '#token7 = :p6',
        ExpressionAttributeValues: {
          ':p6': 'mockKeyValue'
        },
        ExpressionAttributeNames: {
          '#token7': 'name'
        }
      });

      setUpMockWithExpectedParams('queryAsync', expectedParams, { Items: [
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
          restoreMock();
        });
    });

    it('should keep getting if there are more values available', () => {
      mockDb = sinon.mock(dynamodb);

      mockDb.expects('queryAsync')
        .withArgs(sinon.match({
          TableName: 'mock-table',
          KeyConditionExpression: 'mockKey = :p8',
          ExpressionAttributeValues: {
            ':p8': 'mockValue'
          }
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
          KeyConditionExpression: 'mockKey = :p9',
          ExpressionAttributeValues: {
            ':p9': 'mockValue'
          },
          ExclusiveStartKey: {
            'foo': 'bar'
          }
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
            restoreMock();
          });
    });
  });
});