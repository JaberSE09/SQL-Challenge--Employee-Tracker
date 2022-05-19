const mysql = require('mysql2');
//connects to the database
const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'root',
  database: 'company'
});

module.exports = db;
