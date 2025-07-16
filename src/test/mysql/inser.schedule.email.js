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

function getRandomDateBetween(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const now = new Date();
const past = new Date();
past.setDate(now.getDate() - 365);

const insertBatch = async () => {
	const value = [];
	for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
		const now = new Date();
		const from_email = `sender${i + 1}@example.com`;
		const to_email = `recipient${i + 1}@example.com`;
		const subject = `Test Subject ${i + 1}`;
		const body = `This is the plain text body for email ${i + 1}.`;
		const html_body = `<p>This is the <b>HTML</b> body for email ${i + 1}.</p>`;
		const scheduled_time = new Date(
			now.getTime() +
				Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 + // Ngày ngẫu nhiên (0-29 ngày)
				Math.floor(Math.random() * 24) * 60 * 60 * 1000 + // Giờ ngẫu nhiên (0-23 giờ)
				Math.floor(Math.random() * 60) * 60 * 1000 + // Phút ngẫu nhiên (0-59 phút)
				Math.floor(Math.random() * 60) * 1000, // Giây ngẫu nhiên (0-59 giây)
		);
		const status = 'pending';
		const retry_count = 0;
		const max_retries = 3;
		const cc = `cc${i + 1}@example.com`;
		const bcc = `bcc${i + 1}@example.com`;
		const job_id = null;

		const createdAt = getRandomDateBetween(past, now);
		const updatedAt = getRandomDateBetween(createdAt, now);
		value.push([
			currentId,
			from_email,
			to_email,
			subject,
			body,
			html_body,
			scheduled_time,
			status,
			retry_count,
			max_retries,
			cc,
			bcc,
			job_id,
			createdAt,
			updatedAt,
		]);
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

	const sql = `INSERT INTO ScheduledEmails (id ,from_email, to_email, subject, body, html_body, scheduled_time, status, retry_count, max_retries, cc, bcc, job_id, createdAt, updatedAt) VALUES ?`;
	pool.query(sql, [value], async function (err, result) {
		if (err) throw err;
		console.log(`inserted ${result.affectedRows} record`);
		await insertBatch();
	});
};

insertBatch().catch((err) => console.log(err));
