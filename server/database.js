const { Pool } = require('pg');
require('dotenv').config();

//To read environment variables from a local .env file, for the way we are deploying we'll have to set this
//where we are deploying along with all the other env variables.
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// Create a pool for PostgreSQL connections.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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