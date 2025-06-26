require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const Job = require('./models/Job');

mongoose.connect(process.env.MONGO_URI);
const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

async function processJobs() {
  while (true) {
    const res = await redis.xread('BLOCK', 0, 'STREAMS', 'jobs-stream', '0');
    const [stream, messages] = res[0];

    for (const [id, fields] of messages) {
      const data = {};
      for (let i = 0; i < fields.length; i += 2) data[fields[i]] = fields[i + 1];
      
      const job = await Job.findOne({ request_id: data.request_id });
      job.status = 'processing';
      await job.save();

      const vendorUrl = data.vendor === 'vendorA'
        ? 'http://vendor-sync:5000/vendorA'
        : 'http://vendor-async:5001/vendorB';

      try {
        const response = await axios.post(vendorUrl, { request_id: data.request_id });
        if (response.status === 200) {
          job.result = response.data;
          job.status = 'complete';
          await job.save();
        }
      } catch (err) {
        console.error(err);
        job.status = 'failed';
        await job.save();
      }
    }
  }
}

processJobs();
