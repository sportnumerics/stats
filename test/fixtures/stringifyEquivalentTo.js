'use strict';

const sinon = require('sinon');

module.exports = function stringifyEquivalentTo(value) {
  return sinon.match((otherValue) => {
    return JSON.stringify(value) === JSON.stringify(otherValue);
  });
};
