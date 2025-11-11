const { Worker } = require("bullmq");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const redisConnection = require("../config/redis");

let counters = {
  totalFetched: 0,
  newJobs: 0,
  updatedJobs: 0,
  failedJobs: 0,
  failedReasons: [],
};

// Create Worker to consume "jobQueue"
const worker = new Worker(
  "jobQueue",
  async (job) => {
    counters.totalFetched++;

    try {
      const { title, link, description, pubDate, company } = job.data;

      if (!link) throw new Error("Job link missing");

      const existingJob = await Job.findOne({ link });

      if (existingJob) {
        await Job.updateOne(
          { link },
          { title, description, pubDate, company, updatedAt: new Date() }
        );
        counters.updatedJobs++;
        console.log(`Updated job: ${title}`);
      } else {
        await Job.create({ title, link, description, pubDate, company });
        counters.newJobs++;
        console.log(`Added new job: ${title}`);
      }
    } catch (err) {
      counters.failedJobs++;
      counters.failedReasons.push(err.message);
      console.error("Job processing error:", err.message);
      throw err; 
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, 
  }
);

// When all jobs in queue are processed
worker.on("drained", async () => {
  console.log("All jobs processed. Saving ImportLog...");

  try {
    if (counters.totalFetched > 0) {
      await ImportLog.create({
        fileName: "job_feed",
        ...counters,
        timestamp: new Date(),
      });

      console.log(
        `Import summary saved: ${counters.newJobs} new, ${counters.updatedJobs} updated, ${counters.failedJobs} failed`
      );
    }
  } catch (err) {
    console.error("Failed to save import log:", err.message);
  } finally {
    counters = {
      totalFetched: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: 0,
      failedReasons: [],
    };
  }
});

worker.on("failed", (job, err) => {
  console.error(`Job failed [ID:${job.id}]`, err.message);
});

worker.on("error", (err) => {
  console.error("Redis / Worker error:", err.message);
});

module.exports = worker;
