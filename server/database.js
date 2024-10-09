const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, // Required for Render or other cloud DB hosts with SSL
});

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
    queryDB
};