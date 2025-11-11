const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  link: { type: String, unique: true },
  company: String,
  description: String,
  pubDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
