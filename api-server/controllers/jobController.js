const Job = require('../models/Job');
const { v4: uuidv4 } = require('uuid');
const redis = require('../utils/queue');

exports.createJob = async (req, res) => {
  const request_id = uuidv4();
  await Job.create({ request_id, vendor: req.body.vendor });
  await redis.xadd('jobs-stream', '*', 'request_id', request_id, 'vendor', req.body.vendor);
  res.json({ request_id });
};

exports.getJob = async (req, res) => {
  const job = await Job.findOne({ request_id: req.params.id });
  if (!job) return res.status(404).send('Job not found');
  res.json(job);
};
