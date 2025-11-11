const axios = require("axios");
const { xmlToJson } = require("../utils/xmlToJson");
const { jobQueue } = require("../queue/jobQueue");

const urls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://jobicy.com/?feed=job_feed&job_categories=marketing",
  "https://jobicy.com/?feed=job_feed&job_categories=sales",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];


const getCompany = (item) => {
  return (
    item["job:company"] ||
    item["company"] ||
    item["dc:creator"] ||
    item["author"] ||
    (item["source"] && item["source"]["_"]) ||
    "Unknown"
  );
};

exports.fetchJobsAndQueue = async () => {
  let totalQueued = 0;
  let failedUrls = [];

  for (const url of urls) {
    try {
      console.log(`Fetching jobs from: ${url}`);

      const { data } = await axios.get(url, { timeout: 30000 });
      const json = await xmlToJson(data);
      const items = json?.rss?.channel?.item || [];

      console.log(`Found ${items.length} jobs in this feed.`);

      for (const item of items) {
    
        const jobData = {
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
          company: getCompany(item),
        };

        await jobQueue.add("importJob", jobData, {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000, 
          },
        });

        totalQueued++;
      }

      console.log(`Successfully queued ${items.length} jobs from ${url}\n`);
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
      failedUrls.push({ url, error: err.message });
    }
  }
  
  console.log(`Total Jobs Queued: ${totalQueued}`);
  console.log(`Feeds Failed: ${failedUrls.length}`);
  if (failedUrls.length > 0) console.table(failedUrls);
  console.log("Job Import Queuing Completed.");

  return totalQueued;
};
