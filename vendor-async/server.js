const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/vendorB', (req, res) => {
  setTimeout(() => {
    axios.post(`http://api-server:4000/vendor-webhook/vendorB`, {
      request_id: req.body.request_id,
      result: { vendor: 'vendorB', data: 'async result' }
    });
  }, 3000);
  res.status(202).send('Got it');
});

app.listen(5001, () => console.log('Async vendor running'));
