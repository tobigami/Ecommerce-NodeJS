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

module.exports = app;
