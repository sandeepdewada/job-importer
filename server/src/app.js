const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/../.env" });
const { connectDB } = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
require("./workers/jobWorker");
require("./cron/jobCron");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use("/api/jobs", jobRoutes);

connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
