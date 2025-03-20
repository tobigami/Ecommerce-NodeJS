'use strict';

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME, MYSQL_PORT } = process.env;

module.exports = {
	development: {
		username: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DB_NAME,
		host: MYSQL_HOST,
		port: MYSQL_PORT,
		dialect: 'mysql',
		pool: {
			min: 1,
			max: 5,
			acquire: 30000,
			idle: 10000
		}
	},
	production: {
		username: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DB_NAME,
		host: MYSQL_HOST,
		port: MYSQL_PORT,
		dialect: 'mysql',
		pool: {
			min: 1,
			max: 5,
			acquire: 30000,
			idle: 10000
		}
	}
};
