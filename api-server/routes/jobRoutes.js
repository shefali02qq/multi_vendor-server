const express = require('express');
const router = express.Router();
const { createJob, getJob } = require('../controllers/jobController');
const { receiveWebhook } = require('../controllers/webhookController');

router.post('/jobs', createJob);
router.get('/jobs/:id', getJob);
router.post('/vendor-webhook/:vendor', receiveWebhook);

module.exports = router;
