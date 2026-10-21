import mysql from 'mysql2/promise'

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Nice_29042007',
    database: 'mobile_distributor',
})
export default db