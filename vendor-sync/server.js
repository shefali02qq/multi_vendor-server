const express = require('express');
const app = express();
app.use(express.json());

app.post('/vendorA', (req, res) => {
  res.json({ vendor: 'vendorA', data: 'some clean result' });
});

app.listen(5000, () => console.log('Sync vendor running'));
