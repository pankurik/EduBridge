const express = require('express');
const userRoutes = require('./routes/routes');
const cors = require('cors');
const discussionRoutes = require('./routes/discussionroutes');

const app = express();

// Configure CORS to expose specific headers
const corsOptions = {
  exposedHeaders: ['Content-Disposition', 'X-Suggested-Filename'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use userRoutes for any request that comes to '/api/users'
app.use('/', userRoutes);
app.use('/api/discussions', discussionRoutes);

// Export the app instance for testing
module.exports = app;