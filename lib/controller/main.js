const _ = require('lodash');
const divisions = require('./divisions');
const teamsController = require('./teams');
const scheduleController = require('./schedule');
const config = require('config');
const predict = require('../service/predict');

async function collect({ year }, { maxTeamCount = Number.MAX_SAFE_INTEGER } = {}) {
  try {
    const divs = await divisions.collect(year);

    const schedules = []
    for (const div of divs) {
      const teams = await teamsController.collect(year, div);

      for (const team of teams.slice(0, maxTeamCount)) {
        try {
          const schedule = await scheduleController.collect(team);

          schedules.push(schedule);
        } catch (err) {
          console.error(`Unable to collect schedule for ${team.id}, skipping`, err);
        }
      }
    }

    await teamsController.normalize({ year, divs, teams: schedules });

    await predict.initiate(year);
    process.exit(0);
  } catch (err) {
    console.error(`Failed to collect ${year}`, err);
    process.exit(1);
  }
}

module.exports = {
  collect
}
