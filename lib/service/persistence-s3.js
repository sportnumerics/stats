const S3 = require('./s3');
const config = require('config');
const assert = require('assert');

function get(Bucket, Key) {
  return S3.getObjectAsync({
    Bucket,
    Key
  });
}

function set(Bucket, Key, Body) {
  return S3.putObjectAsync(Object.assign({}, config.S3ObjectParams, {
    Bucket,
    Key,
    Body
  }));
}

module.exports = {
  get,
  set
};