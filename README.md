# Job Importer Project

## Overview
Job Importer automatically fetches jobs from multiple XML feeds, converts them to JSON, queues them in Redis using BullMQ, and stores them in MongoDB. It includes a Next.js dashboard to view import logs and manually trigger imports.

---
# Clone repo
git clone <repo_url>
cd job-importer/server


## Tech Stack

- **Frontend:** Next.js, React, Axios  
- **Backend:** Node.js, Express, MongoDB, BullMQ, Cron  
- **Queue & Worker:** Redis (Upstash or local)  
- **Database:** MongoDB Atlas  

---

## Features

 Fetch & queue jobs from multiple XML feeds  
 Convert XML → JSON  
 Avoid duplicates, auto-update existing jobs  
 Save Import Logs (new/updated/failed counts)  
 Background processing with BullMQ worker  
 Cron auto-import every hour  
 Manual import trigger via API  
 Simple Next.js dashboard to view logs  
 Auto-refresh every 30 seconds  

---


## Backend Setup

### 1. Install Dependencies

``bash cmd
cd job-importer/server
npm install --save-dev typescript ts-node @types/express @types/node nodemon
npm install express mongoose axios bullmq ioredis xml2js cors dotenv node-cron winston``

``terminal run cmd
node src/app.js
``

Configure Environment

# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jobimporter

# Redis Configuration (Upstash)
REDIS_HOST=helped-guppy-26472.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=AWdoAAIncDI1YTllNGU4ZDI4NTg0YTRmYWYxZTRiNTMyOWZiZDgyZnAyMjY0NzI



#Frontend Setup

cd job-importer
npx create-next-app client
cd client
npm install axios


terminal run cmd 
``cd client
npm run dev``
Open: http://localhost:3000
Dashboard + Import Jobs Now button + auto-refresh visible


#Cron Job
|
Runs automatically every 1 hour
Fetches jobs from XML feeds
Updates MongoDB and ImportLog

Testing APIs

GET http://localhost:5000/api/jobs/import
GET http://localhost:5000/api/jobs/logs



share a screenshot
<img width="1904" height="978" alt="image" src="https://github.com/user-attachments/assets/715def09-35c1-47c6-b1da-1640c397b4a1" />



















