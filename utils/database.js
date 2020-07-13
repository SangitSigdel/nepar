const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const host = process.env.SQL_HOST
const user = process.env.SQL_USER
const password = process.env.SQL_PASSWORD
const database = process.env.SQL_DATABASE

const con = mysql.createConnection({
    host: `${host}`,
    user: `${user}`,
    password: `${password}`,
    database: `${database}`
});

module.exports = con