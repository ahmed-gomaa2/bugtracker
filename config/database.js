const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '34.31.56.119',
    user: 'root',
    port: 3306,
    database: 'bugtracker',
    password: 'CivilWeb1!',
    logging: false,
    debug: false
});

connection.connect(err => {
    if(err) console.log(err);
});

module.exports = connection;
