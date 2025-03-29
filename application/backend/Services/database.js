const mysql = require('mysql2/promise');

// Create a MySQL pool with `mysql2` promise support
const pool = mysql.createPool({
    connectionLimit : 1000,
    host     : '3.141.35.121',    
    user     : 'root',
    password : 'rootpassword',
    database : 'csc848',
    port     : 3306
});

module.exports = pool;
