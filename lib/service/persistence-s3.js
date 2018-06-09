const S3 = require('./s3');
const config = require('config');
const assert = require('assert');

async function get(Bucket, Key) {
  const { Body, ...rest } = await S3.getObjectAsync({
    Bucket,
    Key
  });

  const parsedBody = JSON.parse(Body);

  return {
    Body: parsedBody,
    ...rest
  };
}

function set(Bucket, Key, Body) {
  return S3.putObjectAsync(Object.assign({}, config.S3ObjectParams, {
    Bucket,
    Key,
    Body: JSON.stringify(Body)
  }));
}

module.exports = {
  get,
  set
};