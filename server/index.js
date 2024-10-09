const express = require('express');
const { connectDB, queryDB } = require('./db/database');
require('dotenv').config({path: '../.env'});


const app = express();
const port = process.env.PORT || 3000;

// Test the database connection on app startup
connectDB();

// Simple route to test the database connection and run a sample query
app.get('/test-db', async (req, res) => {
  try {
    // Optionally run a simple query to ensure the connection is working
    const result = await queryDB('SELECT 1'); // This is a simple query that will always succeed

    res.send('Database connection and query successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
