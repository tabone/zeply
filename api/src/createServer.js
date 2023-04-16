'use strict'

const cors = require('cors')
const express = require('express')

const routes = require('./routes')

module.exports = function createServer(info = {}) {
  const { db, rates, mempool } = info

  const app = express()
  app.use(cors())

  routes.forEach((endpoint) => {
    console.info(`Registering ${endpoint.name}`)
    endpoint.register({ db, app, rates, mempool })
  })

  return app
}
