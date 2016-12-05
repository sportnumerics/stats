'use strict';

function collect(event, context, callback) {
  const message = {
    message: 'Hi',
    event
  };

  callback(null, message);
}

module.exports = {
  collect
}
