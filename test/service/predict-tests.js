'use strict';

const fixtures = require('../fixtures.js'),
  sinon = require('sinon'),
  predict = require('../../lib/service/predict');

describe('predict service', () => {
  it('should invoke aws lambda predict function', () => {
    let expectedParams = {
      FunctionName: sinon.match.any,
      InvocationType: "Event",
      Payload: "{\"year\":\"2016\"}"
    }
    let mockLambda = {
      invoke: sinon.mock().withArgs(expectedParams).callsArgWith(1, null, {})
    };
    var promise = predict.initiate('2016', mockLambda);

    return expect(promise).to.be.fulfilled;
  });
});
