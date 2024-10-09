const { Pool } = require('pg');
//TODO: Ronnie, important to be able to just use config without path.
require('dotenv').config({path: '../.env'});

//To read environment variables from a local .env file, for the way we are deploying we'll have to set this
// //where we are deploying along with all the other env variables.
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// Create a pool for PostgreSQL connections.
//TODO: Ronnie, figure out ssl issue.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // Disable certificate verification for self-signed certs
    }
});

// Connect to the database (optional: can call once at startup)
const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database");
        //Test database connection.
        const res = await client.query('SELECT NOW()'); // simple query to test connection
        console.log('Test query result:', res.rows);
        //End Test
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