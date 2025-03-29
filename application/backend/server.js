const express = require('express');
const userRoutes = require('./routes/routes'); // Import the user routes
const cors = require('cors');
const discussionRoutes = require('./routes/discussionroutes'); //Discussion Routes

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to expose specific headers
const corsOptions = {
    exposedHeaders: ['Content-Disposition', 'X-Suggested-Filename'], // Add any other headers that need to be exposed
};

app.use(cors(corsOptions));  // Use customized CORS options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use userRoutes for any request that comes to '/api/users'
app.use('/', userRoutes);
app.use('/api/discussions', discussionRoutes); // Use discussion routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
