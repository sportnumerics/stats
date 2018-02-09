const _ = require('lodash');
const divisions = require('./divisions');
const teamsController = require('./teams');
const scheduleController = require('./schedule');
const config = require('config');

async function collect({ year }) {
  const divs = await divisions.collect(year);

  const schedules = []
  for (const div of divs) {
    const teams = await teamsController.collect(year, div);

    for (const team of teams) {
      const schedule = await scheduleController.collect(team);

      schedules.push(schedule);
    }
  }

  await teamsController.normalize({ year, divs, teams: schedules });
}

module.exports = {
  collect
}
