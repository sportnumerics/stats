'use strict';

function snsToJson(sns) {
  return JSON.parse(sns.Records[0].Sns.Message);
}

function jsonToSnsParams(jsonObject) {
  return {
    Message: JSON.stringify(jsonObject)
  };
}

module.exports = {
  snsToJson,
  jsonToSnsParams
};
