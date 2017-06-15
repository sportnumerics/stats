'use strict';

const dynamodb = require('../../lib/service/dynamodb');
const persistence = require('../../lib/service/persistence');
const sinon = require('sinon');

describe('persistence-service', () => {
  let mockDb;

  function setUpMockWithExpectedParams(expectedParams) {
    mockDb = sinon.mock(dynamodb)
      .expects('updateAsync')
      .withArgs(expectedParams)
      .returns(new Promise.resolve());
  }

  afterEach(() => {
    dynamodb.updateAsync.restore();
  })

  it('set should correctly interpolate parameter names', () => {
    let expectedParams = {
      TableName: 'mock-table',
      Key: { 'mockKeyName': 'mockKeyValue' },
      UpdateExpression: 'set mockItemKey = :p1',
      ExpressionAttributeValues: {
        ':p1': 'mockItemValue'
      },
      ExpressionAttributeNames: undefined
    }

    setUpMockWithExpectedParams(expectedParams);    

    return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'mockItemKey': 'mockItemValue' })
      .then(() => {
        mockDb.verify();
      });
  });

  it('should correctly extract reserved keys as expression attributes', () => {
    let expectedParams = {
      TableName: 'mock-table',
      Key: { 'mockKeyName': 'mockKeyValue' },
      UpdateExpression: 'set #token3 = :p2',
      ExpressionAttributeValues: {
        ':p2': 'mockItemValue'
      },
      ExpressionAttributeNames: {
        '#token3': 'name'
      }
    }

    setUpMockWithExpectedParams(expectedParams);

    return persistence.set('mock-table', { 'mockKeyName': 'mockKeyValue' }, { 'name': 'mockItemValue' })
      .then(() => {
        mockDb.verify();
      });
  });
});