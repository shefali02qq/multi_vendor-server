const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Mongo connected'))
.catch(err => console.error('Mongo error', err));
