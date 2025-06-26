require('dotenv').config();
require('./utils/db');
const express = require('express');
const app = express();
app.use(express.json());
const routes = require('./routes/jobRoutes');
app.use('/', routes);
app.listen(process.env.PORT, () => console.log('API server running'));
