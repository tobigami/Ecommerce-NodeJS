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

const batchSize = 10000;
const totalSize = 15_000_000;

let currentId = 1;

console.time();

function generatePhoneNumber() {
	const prefixes = [
		'032',
		'033',
		'034',
		'035',
		'036',
		'037',
		'038',
		'039', // Viettel
		'070',
		'076',
		'077',
		'078',
		'079', // Mobifone
		'081',
		'082',
		'083',
		'084',
		'085',
		'086', // Vinaphone
		'056',
		'058', // Vietnamobile
		'059',
	]; // Gmobile

	const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
	const number = Math.floor(1000000 + Math.random() * 9000000); // 7 số còn lại
	return prefix + number;
}

function generateRandomPassword(length = 4) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	let password = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * chars.length);
		password += chars[randomIndex];
	}
	return password;
}

function getRandomDateBetween(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const now = new Date();
const past = new Date();
past.setDate(now.getDate() - 365);

const insertBatch = async () => {
	const value = [];
	for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
		const email = `user_${currentId}@example.com`;
		const phone = generatePhoneNumber();
		const name = `user_${currentId}`;
		const password = generateRandomPassword(4);
		const status = Math.floor(Math.random() * 2); // 0 or 1
		const now = new Date();

		const createdAt = getRandomDateBetween(past, now);
		const updatedAt = getRandomDateBetween(createdAt, now);
		// const createdAt = now;
		// const updatedAt = now;
		value.push([currentId, email, phone, name, password, status, createdAt, updatedAt]);
		currentId++;
	}

	if (!value.length) {
		pool.end((err) => {
			console.timeEnd();
			if (err) {
				console.log('close pool error');
			} else {
				console.log('close pool successfully');
			}
		});
		return;
	}

	const sql = `INSERT INTO users (user_id, user_email, user_phone, user_username, user_password, user_status, user_createdAt, user_updatedAt) VALUES ?`;
	pool.query(sql, [value], async function (err, result) {
		if (err) throw err;
		console.log(`inserted ${result.affectedRows} record`);
		await insertBatch();
	});
};

insertBatch().catch((err) => console.log(err));

