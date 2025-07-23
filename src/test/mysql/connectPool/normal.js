/**
 * Test MySQL connection pool with Express.js
 * Run with: "ab -c 20 -t 10 http://localhost:3055/normal"
 * 20 connections, 10 seconds test
 */

require('module-alias/register');
const config = require('@/configs/config');
const mysql = require('mysql2');

const express = require('express');
const { get } = require('lodash');
const app = express();

console.log('config', config);

function getConnection() {
	return mysql.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		database: config.mysql.database,
		waitForConnections: true,
		connectionLimit: 10,
	});
}

app.get('/normal', (req, res) => {
	const connection = getConnection();
	connection.query('SELECT * FROM ScheduledEmails LIMIT 20', (error, result, field) => {
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
