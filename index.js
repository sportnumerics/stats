const main = require('./lib/controller/main');

const year = process.env.YEAR || new Date().getFullYear().toString();

main.collect({ year })
  .then(() => console.log('done'))
  .catch((err) => console.error(err));
