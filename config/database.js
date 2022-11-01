const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'bugtracker',
    password: 'testtest',
    logging: false,
    debug: false
});

connection.connect(err => {
    if(err) console.log(err);
});

module.exports = connection;
