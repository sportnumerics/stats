const main = require('./lib/controller/main');
const dateChecker = require('./lib/adapter/date-checker');

const year = process.env.YEAR || new Date().getFullYear().toString();

if (dateChecker.shouldRefreshStats()) {
  main
    .collect({ year })
    .then(() => {
      console.log('done');
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.log("Skipping stats collection because we're out of season");
}
