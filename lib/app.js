const express = require('express');
const app = express();

app.use(express.json());

// recipes route
app.use('/api/v1/recipes', require('./routes/recipes'));

// events route
app.use('/api/v1/events', require('./routes/events'));

// error handling
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
