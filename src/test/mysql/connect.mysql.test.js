require('dotenv').config()

const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: '1',
    database: 'shopDev'
})

pool.query('SELECT * from users', function(err, result) {
    
    if(err) throw err

    console.log('result', result)

    pool.end(err => {
        if(err) throw err
        console.log('close pool connection')
    })
})