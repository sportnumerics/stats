'use strict';

global.Promise = require('bluebird');
require('isomorphic-fetch');
const promiseRetry = require('promise-retry');

module.exports = function(url, params) {
  let retries = 5
  if (params && params.retries) {
    retries = params.retries;
  }

  return promiseRetry((retry, number) => {
      return fetch(url, params)
        .catch(error => {
          retry(error);
        }).then(response => {
          if (response.status == 403) {
            const msg = `Forbidden, stopping because we're probably rate limited`;
            console.log(msg);
            throw new Error(msg);
          }
          if (response.status != 200) {
            const msg = `Failed to fetch, status code: ${response.status}. Will retry; currently on attempt ${number}`;
            console.log(msg);
            retry(new Error(msg));
          }
          return response;
        });
    }, {retries});
}
