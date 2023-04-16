'use strict'

module.exports = require('./src')({
  port: 8080,
  mempool: {
    host: process.env.MEMPOOL_HOST
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
})
