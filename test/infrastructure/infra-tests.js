const fixtures = require('../fixtures');
const AWS = require('aws-sdk');
const cloudformation = new AWS.CloudFormation({ region: 'us-east-1' });
const fs = require('fs');
const path = require('path');

describe('infrastructure', () => {
  describe('cloudformation template', () => {
    it('should be valid', (done) => {
      const TemplateBody = fs.readFileSync(path.resolve(__dirname, '..', '..', 'cloudformation.yml'), 'utf8');
      cloudformation.validateTemplate({
        TemplateBody
      }, (err, data) => {
        if (err) done(err);
        else done();
      });
    });
  });
});
