'use strict';

global.Promise = require('bluebird');
const AWS = require('aws-sdk');
const config = require('config');

const S3 = new AWS.S3();

function write(filename, contents) {
  return new Promise((resolve, reject) => {
    const params = Object.assign(config.S3ObjectParams, {
      "Bucket": config.S3Bucket,
      "Key": filename,
      "Body": JSON.stringify(contents)
    });

    S3.putObject(params, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    })
  });
}

module.exports = {
  write
};
