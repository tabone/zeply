'use strict'

const knex = require('knex')
const createDB = require('./createDB')

const knexObj = {}

jest.mock('knex')

describe('Create DB Unit Tests', () => {
  beforeEach(() => {
    knex.mockReturnValue(knexObj)
    jest.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    knex.mockReset()
    console.info.mockRestore()
  })

  describe('Creating a DB Client with specific arguments', () => {
    describe('When creating a new DB Client', () => {
      let info = null
      let client = null

      beforeEach(() => {
        info = {
          host: 'test-host',
          port: 1234,
          user: 'test-user',
          password: 'test-password',
          database: 'test-database'
        }

        client = createDB(info)
      })

      it('should be created with the parameters specified', () => {
        expect(knex).toHaveBeenCalledTimes(1)

        expect(knex.mock.calls[0][0]).toEqual({
          client: 'pg',
          connection: {
            host: info.host,
            port: info.port,
            user: info.user,
            password: info.password,
            database: info.database
          },
          pool: { min: 0, max: 4 }
        })
      })

      it('should return a DB Client', () => {
        expect(client).toBe(knexObj)
      })
    })
  })

  describe('Creating a DB Client without arguments', () => {
    describe('When creating a new DB Client', () => {
      let client = null

      beforeEach(() => {
        client = createDB()
      })

      it('should be created with the default parameters', () => {
        expect(knex).toHaveBeenCalledTimes(1)

        expect(knex.mock.calls[0][0]).toEqual({
          client: 'pg',
          connection: {
            host: '127.0.0.1',
            port: 5432,
            user: 'leeroy',
            password: 'jenkins',
            database: 'zeply'
          },
          pool: { min: 0, max: 4 }
        })
      })

      it('should return a DB Client', () => {
        expect(client).toBe(knexObj)
      })
    })
  })
})
