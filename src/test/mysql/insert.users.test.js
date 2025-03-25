//  test insert 20m users to mysql db with node js

// sử dụng procedures thì tốn 1m23s cho 10k users -> rất là lâu

//  17s - 20m record 10m

const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'dev',
});

const batchSize = 1000;
const totalSize = 20_000;

let currentId = 1;

console.time();

const insertBatch = async () => {
	const value = [];
	for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
		const name = `User_${currentId}`;
		const age = Math.floor(Math.random() * (30 - 18) + 18);
		const email = `user_${currentId}@example.com`;
		const now = new Date();
		const createdAt = now;
		const updatedAt = now;
		value.push([currentId, name, email, age, createdAt, updatedAt]);
		currentId++;
	}

	if (!value.length) {
		pool.end((err) => {
			console.timeEnd();
			if (err) {
				console.log('close pool error');
			} else {
				console.log('close pool error successfully');
			}
		});
		return;
	}

	const sql = `INSERT INTO Users (id, name, email, age, createdAt, updatedAt) VALUES ?`;
	pool.query(sql, [value], async function (err, result) {
		if (err) throw err;
		console.log(`inserted ${result.affectedRows} record`);
		await insertBatch();
	});
};

insertBatch().catch((err) => console.log(err));
