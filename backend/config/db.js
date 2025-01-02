// config/db.js

const mysql = require('mysql2');

// Create the connection pool to the MySQL database
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Your MySQL username
  password: '',  // Your MySQL password
  database: 'job_portal'
});

module.exports = pool; // Promises API for async/await usage
