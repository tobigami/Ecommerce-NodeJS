const compression = require('compression')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const express = require('express')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db

// init routers
app.get('/', (req, res, next) => {
  const text = 'ThanhDD'
  return res.status(200).json({
    message: 'Welcome to my api',
    metadata: text.repeat(10000)
  })
})

// handling error

module.exports = app