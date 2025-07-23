const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const port = process.env.PORT;

const config = {
	port: process.env.PORT,
	mysql: {
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DB_NAME,
	},
};

module.exports = config;
