'use strict';

const { Sequelize } = require('sequelize');
const { development } = require('../configs/mysql.config');

const sequelize = new Sequelize(development.database, development.username, development.password, {
	host: development.host,
	port: development.port,
	dialect: development.dialect,
	pool: development.pool,
	logging: development.logging
});

const connectMysqlDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('\x1b[35m Connect MySQL DB:\x1b[32m success');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		process.exit(1);
	}
};

module.exports = { sequelize, connectMysqlDB };
