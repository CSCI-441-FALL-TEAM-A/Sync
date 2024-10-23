const { Pool } = require('pg');
const { db } = require('./config'); // Load old_db config from config.js

// Create a pool for PostgreSQL connections.
const pool = new Pool(db);

// Connect to the database (optional: can call once at startup)
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database");
        client.release();
    } catch (err) {
        console.error("Database connection error", err);
    }
};

// Query the database
const queryDB = async (queryText, params) => {
    try {
        const res = await pool.query(queryText, params);
        return res.rows;
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

module.exports = {
    connectDB,
    queryDB,
    pool,
};
