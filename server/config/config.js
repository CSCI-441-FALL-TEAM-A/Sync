const dotenv = require('dotenv');

// Load environment variables only when not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: '../.env'});
}

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    }
};