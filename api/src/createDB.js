'use strict'

const knex = require('knex')

module.exports = function createDB(info = {}) {
  const {
    host = '127.0.0.1',
    port = 5432,
    user = 'leeroy',
    password = 'jenkins',
    database = 'zeply'
  } = info

  console.info('Setup DB', {
    host,
    port,
    user,
    database
  })

  return knex({
    client: 'pg',
    connection: {
      host,
      port,
      user,
      password,
      database
    },
    pool: { min: 0, max: 4 }
  })
}
