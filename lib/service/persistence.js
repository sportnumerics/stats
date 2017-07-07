'use strict';

const _ = require('lodash');
const db = require('./dynamodb');
const isKeyword = require('../data/is-keyword');
const async = require('async');

const ATTRIBUTE_PREFIX = ':p';

function set(table, key, object) {
  let interpolations = getInterpolations(object, key);
  let updateExpression = `set ${_.map(interpolations, 'expression').join(', ')}`;
  let params = {
    TableName: table,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: mapInterpolationsToExpressionAttributeValues(interpolations),
    ExpressionAttributeNames: mapInterpolationsToExpressionAttributeNames(interpolations)
  };
  return db.updateAsync(params)
}

function get(table, key, options = {}) {
  let initialMemo = {
    results: [],
    exclusiveStartKey: undefined
  };
  return reduceWhilst(initialMemo, memo => {
    let { exclusiveStartKey } = memo;
    let getOptions = Object.assign({}, options, { exclusiveStartKey });
    return getOnce(table, key, getOptions)
      .then(data => {
        return {
          results: [].concat(memo.results, data.Items),
          exclusiveStartKey: data.LastEvaluatedKey
        }
      });
  }, memo => memo.exclusiveStartKey)
  .then(finalMemo => {
    return finalMemo.results;
  });
}

function reduceWhilst(initialMemo, reducer, test) {
  let currentMemo = initialMemo;
  return new Promise((resolve, reject) => {
    async.doWhilst(callback => reducer(currentMemo)
      .then(nextMemo => {
        currentMemo = nextMemo;
        return currentMemo;
      }).asCallback(callback),
      test,
      (err, result) => {
        if (err) return reject(err);
        else return resolve(currentMemo);
      });
  });
}

function getOnce(table, key, options = {}) {
  let interpolations = getInterpolations(key);
  let keyConditionExpression = _.map(interpolations, 'expression').join(' and ');
  let params = {
    TableName: table,
    IndexName: options.index,
    ExclusiveStartKey: options.exclusiveStartKey,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: mapInterpolationsToExpressionAttributeValues(interpolations),
    ExpressionAttributeNames: mapInterpolationsToExpressionAttributeNames(interpolations)
  }
  return db.queryAsync(params);
}

function getInterpolations(object, key = {}) {
  return _(object)
    .pickBy(shouldInterpolateObjectKeyValuePairGivenKey(key))
    .map((value, key) => {
      let attribute = _.uniqueId(ATTRIBUTE_PREFIX);
      let { sanitizedName, nameMapping } = sanitizeKeyName(key);
      return {
        attribute,
        expression: `${sanitizedName} = ${attribute}`,
        value,
        nameMapping
      };
    })
    .value();
}

function shouldInterpolateObjectKeyValuePairGivenKey(updateKey) {
  return (objValue, objKey) => {
    if (_.has(updateKey, objKey)) {
      if (updateKey[objKey] === objValue) {
        return false
      } else {
        throw new Error(`Cannot specify a different value for key in key and object to update. Key ${objKey} was ${updateKey[objKey]} but attribute of the same name was ${objValue}.`);
      }
    } else {
      return true;
    }
  }
}

function mapInterpolationsToExpressionAttributeValues(interpolations) {
  return _.zipObject(_.map(interpolations, 'attribute'), _.map(interpolations, 'value'))
}

function mapInterpolationsToExpressionAttributeNames(interpolations) {
  const expressionAttributeNames = _.assign({}, ..._.map(interpolations, 'nameMapping'));
  if (_.isEmpty(expressionAttributeNames)) {
    return undefined;
  } else {
    return expressionAttributeNames;
  }
}

const TOKEN_PREFIX = '#token';

function sanitizeKeyName(keyName) {
  if (isKeyword(keyName)) {
    const token = _.uniqueId(TOKEN_PREFIX);
    return {
      sanitizedName: token,
      nameMapping: { [token]: keyName }
    };
  } else {
    return {
      sanitizedName: keyName,
      nameMapping: {}
    };
  }
}

module.exports = {
  set: set,
  get: get
};
