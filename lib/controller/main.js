const _ = require('lodash');
const divisions = require('./divisions');
const teamsController = require('./teams');
const scheduleController = require('./schedule');
const config = require('config');
const predict = require('../service/predict');

async function collect({ year }) {
  const divs = await divisions.collect(year);

  const schedules = []
  for (const div of divs) {
    const teams = await teamsController.collect(year, div);

    for (const team of teams) {
      try {
        const schedule = await scheduleController.collect(team);

        schedules.push(schedule);
      } catch (err) {
        console.log(`Unable to collect schedule for ${team.id}, skipping`);
      }
    }
  }

  await teamsController.normalize({ year, divs, teams: schedules });

  await predict.initiate(year);
}

module.exports = {
  collect
}
