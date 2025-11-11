const cron = require("node-cron");
const { fetchJobsAndQueue } = require("../services/jobService");

cron.schedule("0 * * * *", async () => {  // Every 1 hour
  console.log("Cron Job Triggered: Fetching Jobs...");
  await fetchJobsAndQueue();
});
