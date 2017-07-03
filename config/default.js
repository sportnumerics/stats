module.exports = {
  S3ObjectParams: {
    ContentType: 'application/json'
  },
  ResultsTable: process.env.RESULTS_TABLE,
  DivisionsTable: process.env.DIVISIONS_TABLE,
  TeamsQueueUrl: process.env.TEAMS_QUEUE_URL
}
