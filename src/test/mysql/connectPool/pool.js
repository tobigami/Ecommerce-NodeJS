/**
 * video: https://www.youtube.com/watch?v=vjHWkHm4cqo
 * Test MySQL connection pool with Express.js
 * Run with: "ab -c 20 -t 10 http://localhost:3055/pool"
 * 20 connections, 10 seconds test
 */

require('module-alias/register');
const config = require('@/configs/config');
const mysql = require('mysql2');

const express = require('express');
const app = express();

function getConnection() {
	return mysql.createPool({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		database: config.mysql.database,
		waitForConnections: true,
		connectionLimit: 10,
	});
}

app.get('/pool', (req, res) => {
	const pool = getConnection();
	pool.query('select * from ScheduledEmails limit 20', (error, result, field) => {
		if (error) {
			res.send(error);
			return;
		}

		res.send(result);
	});
});

app.listen(config.port, () => {
	console.log(`Server is running on port ${config.port}`);
});
