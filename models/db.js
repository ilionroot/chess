const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "mysql669.umbler.com",
    port: 41890,
    user: "scolion",
    password: "maronna2204",
    database: "bancola"
});

module.exports = connection;