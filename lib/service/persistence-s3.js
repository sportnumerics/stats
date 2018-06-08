const S3 = require('./s3');

function get(Bucket, Key) {
  return S3.getObject({
    Bucket,
    Key
  });
}

function set(Bucket, Key, Body) {
  return S3.putObject({
    Bucket,
    Key,
    Body
  });
}

module.exports = {
  get,
  set
};