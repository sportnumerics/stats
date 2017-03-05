'use strict';

let fixtures = require('../fixtures.js'),
  messaging = require('../../lib/service/messaging');

describe('sns payload to json payload', () => {
  it('should convert the message to a json object', () => {
    let payload = messaging.snsEventToJson(fixtures.snsSample);

    expect(payload).to.deep.equal(fixtures.snsPayload);
  });
});

describe('json payload to sns message', () => {
  it('should convert the json object to a message string', () => {
    let snsParams = messaging.jsonToSnsParams(fixtures.snsPayload);

    expect(snsParams).to.deep.equal(fixtures.expectedSnsParams);
  });
});
