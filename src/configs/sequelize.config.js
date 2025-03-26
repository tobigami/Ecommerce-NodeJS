require(`dotenv`).config();

const dev = {
	username: process.env.MYSQL_USERNAME || 'root',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DB_NAME || '',
	host: process.env.MYSQL_HOST || '127.0.0.1',
	dialect: 'mysql',
	port: process.env.MYSQL_PORT || 3306,
	logging: false,
};

const test = {
	...dev,
	database: process.env.MYSQL_DATABASE_TEST || 'your_database_test',
};

const prod = {
	...dev,
	database: process.env.MYSQL_DATABASE_PROD || 'your_database_prod',
};

module.exports = {
	development: dev,
	test: test,
	production: prod,
};
