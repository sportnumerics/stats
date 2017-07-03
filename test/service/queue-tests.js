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
        .returns(Promise.resolve());

      let messages = [{
        key: 'value'
      }];

      return queue.sendMessages(messages).then(() => {
        mockSqs.verify();
        sqs.sendMessageBatchAsync.restore();
      });
    });

    it('should chunk the messages into batches of ten', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(2)
        .returns(Promise.resolve());

      let messagePrototype = { key: 'value' };
      let messages = _.fill(Array(15), messagePrototype);

      return queue.sendMessages(messages).then(() => {
        mockSqs.verify();
        sqs.sendMessageBatchAsync.restore();
      });
    });

    it('should return an error if any of the messages fail to send', () => {
      var mockSqs = sinon.mock(sqs)
        .expects('sendMessageBatchAsync')
        .exactly(1)
        .returns(Promise.reject());

      let messages = [{ key: 'value' }];

      let promise = queue.sendMessages(messages);

      return expect(promise).to.be.rejectedWith('Unable to send message to SQS.');
    })
  });

  describe('receiveMessage', () => {

  });
});