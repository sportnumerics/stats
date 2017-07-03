'use strict';

const sqs = require('./sqs');
const _ = require('lodash');
const config = require('config');

function sendMessages(messages) {
  return Promise.map(_.chunk(messages, 10), messageBatch => {
    let params = {
      Entries: messageBatch.map((message, i) => ({
        Id: String(i),
        MessageBody: JSON.stringify(message)
      })),
      QueueUrl: config.TeamsQueueUrl
    };
    return sqs.sendMessageBatchAsync(params);
  });
}

function receiveMessage() {
  let params = {
    QueueUrl: config.TeamsQueueUrl
  };
  return sqs.receiveMessageAsync(params)
    .then(({ Messages }) => {
      if (Messages.length) {
        let message = Messages[0];
        return {
          id: message.ReceiptHandle,
          body: JSON.parse(message.Body)
        };
      } else {
        return null;
      }
    });
}

function deleteMessage(id) {
  let params = {
    QueueUrl: config.TeamsQueueUrl,
    ReceiptHandle: id
  };
  return sqs.deleteMessageAsync(params);
}

module.exports = {
  sendMessages,
  receiveMessage
};