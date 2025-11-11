const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const jobQueue = new Queue("jobQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = { jobQueue }; 
