const express = require('express');
const { connectDB, queryDB } = require('./config/database');  // Database functions
const config = require('./config/config');  // App configuration

// Routes
const userTypeRoutes = require('./routes/userTypes');
const locationRoutes = require('./routes/Locations');
const proficiencyLevelRoutes = require('./routes/proficiencyLevels');
const genreRoutes = require('./routes/genres');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/Matches');
const profileRoutes = require('./routes/profiles');
const instrumentRoutes = require('./routes/Instruments');
const matchStatusRoutes = require('./routes/matchStatus');


const app = express();
const port = config.port;

// Test the database connection on app startup
connectDB();

//Middleware to use express json.
app.use(express.json());

// Middleware to serve static files from "public" folder
//Ronnie PR?
app.use(express.static('../public'));

// Use the user type routes
app.use('/api/user-types', userTypeRoutes);

// Use the location routes
app.use('/api/locations', locationRoutes);

// Use the proficiency level routes
app.use('/api/proficiency-levels', proficiencyLevelRoutes);

// Use genre routes
app.use('/api/genres', genreRoutes);

// Use user routes
app.use('/api/users', userRoutes);


// Match user route
app.use('/api/matches', matchRoutes);

// Use profile routes
app.use('/api/profiles', profileRoutes);

// Use instrument routes
app.use('/api/instruments', instrumentRoutes);

// Use matchStatus routes
app.use('/api/match-statuses', matchStatusRoutes);


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

// Serve the main index.html file for the front-end
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
