require('dotenv').config();
const compression = require('compression');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const express = require('express');

const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

// init db
require('./dbs/connectDB');
// init routers
app.use('', require('./routers'));
// handling error
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
