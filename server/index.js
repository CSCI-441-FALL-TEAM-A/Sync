const express = require('express');
const { connectDB, queryDB } = require('./config/database');  // Database functions
const config = require('./config/config');  // App configuration

// Routes
const userTypeRoutes = require('./routes/userTypes');
const locationRoutes = require('./routes/locations');

const app = express();
const port = config.port;

// Test the database connection on app startup
connectDB();

//Middleware to use express json.
app.use(express.json());

// Use the user type routes
app.use('/api/user-types', userTypeRoutes);

// Use the location routes
app.use('/api/locations', locationRoutes);

// Simple route to test the database connection and run a sample query
app.get('/test-db', async (req, res) => {
  try {
    const result = await queryDB('SELECT 1');
    res.send('Database connection and query successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
