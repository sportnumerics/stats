'use strict';

const sqs = require('./sqs');
const _ = require('lodash');
const config = require('config');

const BATCH_SIZE = 10;

function sendMessages(messages) {
  return Promise.all(_.chunk(messages, BATCH_SIZE).map((messageBatch, batchNumber) => {
    let params = {
      Entries: messageBatch.map((message, i) => ({
        Id: String(i),
        MessageBody: JSON.stringify(message)
      })),
      QueueUrl: config.TeamsQueueUrl
    };
    console.log(`(${batchNumber}) Sending ${messageBatch.length} messages to SQS.`);
    return sqs.sendMessageBatchAsync(params)
      .then(result => {
        console.log(`(${batchNumber}) Finished sending.`);
        return result;
      })
      .catch(error => {
        console.error(`(${batchNumber}) Unable to send message: ${error}`);
        throw error;
      });
  }))
  .catch(errors => {
    let error = new Error('Unable to send message to SQS.');
    error.errors = errors;
    throw error;
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