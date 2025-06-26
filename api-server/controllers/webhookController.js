const Job = require('../models/Job');

exports.receiveWebhook = async (req, res) => {
  const job = await Job.findOne({ request_id: req.body.request_id });
  if (!job) return res.status(404).send('Job not found');

  job.result = req.body.result;
  job.status = 'complete';
  await job.save();
  res.send('Received');
};
