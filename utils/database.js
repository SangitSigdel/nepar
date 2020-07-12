const mysql = require('mysql')

const host = process.env.SQL_HOST
const user = process.env.SQL_USER
const password = process.env.SQL_PASSWORD
const database = process.env.SQL_DATABASE

const con = mysql.createConnection({
    host: 'localhost',
    user: 'sangit',
    password: 'schoolpage536383',
    database: 'nepar'
});

module.exports = con