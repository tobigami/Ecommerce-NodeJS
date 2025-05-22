require('dotenv').config();
const compression = require('compression');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const express = require('express');

const app = express();
const cors = require('cors');

// 1. init middleware
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(
	cors({
		origin: '*', // Replace with your frontend URL
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	}),
);

// test pub/sub redis
// require('./Test/inventory.test');
// const productTest = require('./Test/product.test');
// productTest.purchaseProduct('product:001', 10);

// 2. INIT DATA BASE
const redisDb = require('./dbs/init.redis.v2'); // redis
redisDb.init();

const { connectMysqlDB } = require('./dbs/init.mysql'); // mysql
connectMysqlDB();

require('./dbs/init.mongo'); // mongo

// 3. INIT ROUTERS
app.use('', require('./routers'));
// 4. HANDLING ERROR
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		stack: error.stack,
		message: error.message || 'Internal Server Error',
	});
});

module.exports = app;
