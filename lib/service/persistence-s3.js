const S3 = require('./s3');
const config = require('config');

function get(Bucket, Key) {
  return S3.getObject({
    Bucket,
    Key
  });
}

function set(Bucket, Key, Body) {
  return S3.putObject(Object.assign({}, config.S3ObjectParams, {
    Bucket,
    Key,
    Body
  }));
}

module.exports = {
  get,
  set
};