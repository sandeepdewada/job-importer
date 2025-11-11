const ImportLog = require("../models/ImportLog");
const { fetchJobsAndQueue } = require("../services/jobService");

exports.importJobs = async (req, res) => {
  try {
    const total = await fetchJobsAndQueue();

    res.json({
      success: true,
      message: "Jobs queued successfully",
      total,
    });
  } catch (err) {
    console.error("Error importing jobs:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to queue jobs",
      error: err.message,
    });
  }
};

exports.getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    console.error("Error fetching import logs:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch import logs",
      error: err.message,
    });
  }
};
