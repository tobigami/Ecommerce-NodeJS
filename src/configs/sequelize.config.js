require(`dotenv`).config();

const development = {
	username: process.env.MYSQL_USERNAME || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DB_NAME || '',
	host: process.env.MYSQL_HOST || '127.0.0.1',
	dialect: 'mysql',
	port: process.env.MYSQL_PORT || 3306,
	logging: false,
};

const test = {
	...development,
	database: process.env.MYSQL_DATABASE_TEST || 'your_database_test',
};

const prod = {
	...development,
	database: process.env.MYSQL_DATABASE_PROD || 'your_database_prod',
};

module.exports = {
	development: development,
	test: test,
	production: prod,
};
