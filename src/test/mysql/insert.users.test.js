//  test insert 20m users to mysql db with node js

// sử dụng procedures thì tốn 1m23s cho 10k users -> rất là lâu

//  17s - 20m record 10m

const exMotobike = ['HonDa', 'Yamaha', ''];

require('module-alias/register');
const config = require('@/configs/config');

const mysql = require('mysql2');

const pool = mysql.createPool({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password,
	database: config.mysql.database,
});

const batchSize = 10000;
const totalSize = 10_000_000;

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

function generateRandomPassword() {
	const motorbikes = [
		'Honda',
		'Yamaha',
		'Suzuki',
		'Kawasaki',
		'Ducati',
		'BMW',
		'KTM',
		'Harley Davidson',
		'Triumph',
		'Vespa',
		'Aprilia',
		'Indian',
		'Moto Guzzi',
		'Royal Enfield',
		'MV Agusta',
		'Benelli',
	];

	// Lấy ngẫu nhiên 2 hãng xe khác nhau
	const randomMotorbike1 = motorbikes[Math.floor(Math.random() * motorbikes.length)];
	let randomMotorbike2;
	do {
		randomMotorbike2 = motorbikes[Math.floor(Math.random() * motorbikes.length)];
	} while (randomMotorbike2 === randomMotorbike1);

	const randomNumber = Math.floor(Math.random() * 900) + 100; // số ngẫu nhiên từ 100-999

	// Tạo một mảng với 3 phần tử và xáo trộn vị trí của chúng
	const parts = [randomMotorbike1, randomMotorbike2, randomNumber.toString()];
	const shuffled = parts.sort(() => Math.random() - 0.5);

	// Ghép các phần tử lại với nhau, có thể thêm dấu cách
	return shuffled.join(' ');
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
