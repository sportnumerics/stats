'use strict';

const sqs = require('../../lib/service/sqs');
const queue = require('../../lib/service/queue');
const sinon = require('sinon');
const _ = require('lodash');

describe('queue-service', () => {
  describe('sendMessages', () => {
    it('should use sendMessageBatchAsync to send a message', () => {
      let expectedParams = {
        Entries: [
          {
            Id: sinon.match.string,
            MessageBody: "{\"key\":\"value\"}"
          }
        ],
        QueueUrl: 'https://mock.teams.queue.url'
      };

      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .withArgs(expectedParams)
        .returns(Promise.resolve(batchSuccessObject(1)));

      let messages = [{
        key: 'value'
      }];

      return queue.sendMessages(messages).then(() => {
        mockSqs.verify();
        sqs.sendMessageBatchAsync.restore();
      });
    });

    it('should chunk the messages into batches of the batch size', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(2);
        
      mockSqs.onFirstCall().returns(Promise.resolve(batchSuccessObject(10)))
        .onSecondCall().returns(Promise.resolve(batchSuccessObject(5)));

      let messagePrototype = { key: 'value' };
      let messages = _.fill(Array(15), messagePrototype);

      return queue.sendMessages(messages, { batchSize: 10 }).then(() => {
        mockSqs.verify();
        sqs.sendMessageBatchAsync.restore();
      });
    });

    it('should return an error if the message post request fails', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(1)
        .returns(Promise.reject(new Error('mock error')));

      let messages = [{ key: 'value' }];

      let promise = queue.sendMessages(messages);

      return expect(promise).to.be.rejectedWith('mock error')
        .then(() => {
          sqs.sendMessageBatchAsync.restore();
        });
    });

    it('should return an error if any of the messages fail to send', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(1)
        .returns(Promise.resolve(batchFailedObject(1)));

      let messages = [{ key: 'value' }];

      let promise = queue.sendMessages(messages);

      return expect(promise).to.be.rejectedWith('Error: Failed batch result: [403] you suck')
        .then(() => {
          sqs.sendMessageBatchAsync.restore();
        });
    });

    it('should return an error if the batch post throws an error', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(1)
        .throws(new Error('mock error'));

      let messages = [{ key: 'value' }];

      let promise = queue.sendMessages(messages);

      return expect(promise).to.be.rejectedWith('mock error')
        .then(() => {
          sqs.sendMessageBatchAsync.restore();
        });
    });
  });

  describe('receiveMessage', () => {

  });
});

function batchSuccessObject(count) {
  return {
    Successful: _.fill(Array(count), {
      Id: 'mock-id',
      MessageId: 'mock-message-id',
      MD5OfMessageBody: 'mock-md5'
    }),
    Failed: []
  };
}

function batchFailedObject(count) {
  return {
    Successful: [],
    Failed: _.fill(Array(count), {
        Id: 'mock-id',
        SenderFault: true,
        Code: '403',
        Message: 'you suck'
      })
  }
}