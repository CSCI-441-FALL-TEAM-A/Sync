const express = require('express');
const { connectDB, queryDB } = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Test the database connection on app startup
connectDB();

// Simple route to test the connection
app.get('/test-db', async (req, res) => {
  try {
    await connectDB();
    res.send('Database connection successful');
  } catch (error) {
    res.status(500).send('Database connection failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
