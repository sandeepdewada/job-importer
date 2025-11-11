const express = require("express");
const router = express.Router();
const { importJobs, getImportLogs, importJobsPost } = require("../controllers/jobController");

router.get("/import", importJobs);      
router.get("/logs", getImportLogs);     

module.exports = router;
