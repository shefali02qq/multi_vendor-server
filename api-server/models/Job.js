const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  request_id: String,
  status: { type: String, enum: ['pending', 'processing', 'complete', 'failed'], default: 'pending' },
  vendor: String,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
