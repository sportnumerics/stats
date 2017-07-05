'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const keywordsFile = path.join(__dirname, 'dynamodb-keywords.txt');
const s = fs.readFileSync(keywordsFile, 'utf8');
const knownKeywords = s.split(/\r?\n/);

module.exports = function isKeyword(keyword) {
  return _.includes(knownKeywords, keyword.toUpperCase());
};