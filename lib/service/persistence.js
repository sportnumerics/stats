'use strict';

const _ = require('lodash');
const db = require('./dynamodb');

const ATTRIBUTE_PREFIX = ':p';

function set(table, key, object) {
  let interpolations = _.map(object, (value, key) => {
    let attribute = _.uniqueId(ATTRIBUTE_PREFIX);
    let { sanitizedName, nameMapping } = sanitizeKeyName(key);
    return {
      attribute,
      expression: `${sanitizedName} = ${attribute}`,
      value,
      nameMapping
    };
  });
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

const KNOWN_RESERVED_KEYWORDS = ['year', 'name'];
const TOKEN_PREFIX = '#token';

function sanitizeKeyName(keyName) {
  if (_.includes(KNOWN_RESERVED_KEYWORDS, keyName)) {
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
  set: set
};
