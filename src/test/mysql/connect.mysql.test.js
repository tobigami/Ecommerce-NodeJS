const mysql = require('mysql2')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: '1',
    database: 'shopDev'
})

const batchSize = 100000;
const totalSize = 1_000_000;

let currentId = 1
console.time()
const insertBatch = async () => {
    const value = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `Name: ${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`
        value.push([currentId, name, age, address])
        currentId++        
    }

    if(!value.length) {
        pool.end((err) => {
            console.timeEnd()
            if(err) {
                console.log('close pool error')
            } else {
                console.log('close pool error successfully')
            }
        })
        return
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [value], async function(err, result) {
        if(err) throw err
        console.log(`inserted ${result.affectedRows} record`)
        await insertBatch()
    })
}

insertBatch().catch(err => console.log(err))

// pool.query('SELECT * from users', function(err, result) {
    
//     if(err) throw err

//     console.log('result', result)

//     pool.end(err => {
//         if(err) throw err
//         console.log('close pool connection')
//     })
// })