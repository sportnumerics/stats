'use strict';

const sqs = require('./sqs');
const _ = require('lodash');
const config = require('config');

const BATCH_CONCURRENCY = 3;
const MAX_PAYLOAD_SIZE = 256000;
const DEFAULT_SEND_OPTIONS = {
  batchSize: 1
};

function sendMessages(messages, options) {
  let { batchSize } = Object.assign({}, DEFAULT_SEND_OPTIONS, options);
  return Promise.map(_.chunk(messages, batchSize), (messageBatch, batchNumber) => {
    let batchCount = messageBatch.length;
    let params = {
      Entries: messageBatch.map((message, i) => ({
        Id: String(i),
        MessageBody: JSON.stringify(message)
      })),
      QueueUrl: config.TeamsQueueUrl
    };

    validateMessageLength(params);

    console.log(`(${batchNumber}) Sending ${batchCount} messages to SQS.`);
    return Promise.try(() => {
        return sqs.sendMessageBatchAsync(params);
      }).catch(error => {
        console.error(`(${batchNumber}) Unable to send message: ${error}`);
        throw error;
      }).then(result => {
        console.log(`(${batchNumber}) Finished sending.`);
        if (result.Successful && result.Successful.length === batchCount) {
          return result
        } else {
          let firstFailedResult = result.Failed[0];
          let error = failedBatchResultToError(firstFailedResult);
          console.log(`(${batchNumber}) Failed to send: ${error}`);
          throw error;
        }
      });
  }, { concurrency: BATCH_CONCURRENCY });
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

function failedBatchResultToError(batchResultError) {
  return new Error(`Failed batch result: [${batchResultError.Code}] ${batchResultError.Message}`);
}

function validateMessageLength(payload) {
  let payloadSize = JSON.stringify(payload).length;
  if (payloadSize > MAX_PAYLOAD_SIZE) {
    throw new Error(`Payload size ${payloadSize} will be too large (>${MAX_PAYLOAD_SIZE}B) to send to SQS.`);
  }
}

module.exports = {
  sendMessages,
  receiveMessage
};