'use strict'

const knex = require('knex')

const mockExpressJS = require('../test-utils/mockExpressJS')
const mockExpressJSResponse = require('../test-utils/mockExpressJSResponse')

const addressesRoute = require('./addresses')

describe('Addresses Unit Tests', () => {
  let db = null
  let app = null
  let rates = null
  let mempool = null

  beforeEach(async () => {
    rates = {
      to(currency, satoshis) {
        return `${currency}-${satoshis}`
      }
    }

    mempool = {
      addresses: {
        getAddress: jest.fn(() => {
          return Promise.resolve({
            mempool_stats: {
              spent_txo_sum: 1
            },
            chain_stats: {
              tx_count: 2,
              spent_txo_sum: 3,
              funded_txo_sum: 5
            }
          })
        })
      }
    }

    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        database: 'test',
        filename: ':memory:'
      }
    })

    await db.raw(
      `
        CREATE TABLE address_searches (
          address_id  VARCHAR(64) NOT NULL,
          ip              INET        NOT NULL,
          created         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `
    )

    app = mockExpressJS()
  })

  afterEach(() => {
    db.destroy()
  })

  describe('Retrieving the name of the route', () => {
    describe('Given a route', () => {
      describe('when getting the name of the route', () => {
        it('should return the expected name', () => {
          expect(addressesRoute.name).toBe('addresses')
        })
      })
    })
  })

  describe('Registering the route', () => {
    describe('Given an ExpressJS Application', () => {
      describe('when registering the route', () => {
        beforeEach(() => {
          addressesRoute.register({ db, app })
        })

        it('should be registered once and in the correct endpoint', () => {
          expect(app.get).toHaveBeenCalledTimes(1)
          expect(app.get.mock.calls[0][0]).toBe('/addresses/:id')
        })
      })
    })
  })

  describe('Failing to retrieve address information from third party API', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        mempool.addresses.getAddress = jest.fn(() => {
          return Promise.reject({
            response: {
              status: 404,
              statusText: 'test-error'
            }
          })
        })

        addressesRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having connected to a third party API that is currently down', () => {
        describe('when attempting to retrieve the address information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              { ip: '127.0.0.1', query: {}, params: { id: 'test-address-id' } },
              res
            )
          })

          it('should attempt to retrieve the information of the requested address', () => {
            expect(mempool.addresses.getAddress).toHaveBeenCalledTimes(1)
            expect(mempool.addresses.getAddress.mock.calls[0][0]).toEqual({
              address: 'test-address-id'
            })
          })

          it('should not crash the application and respond with the appropriate error', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)

            expect(res.status.mock.calls[0][0]).toBe(404)
            expect(res.json.mock.calls[0][0]).toEqual({
              error: 'test-error'
            })
          })

          it('should log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(1)

            expect(console.error.mock.calls[0][0]).toBe(
              'Something went wrong while retrieving an address'
            )
          })
        })
      })
    })
  })

  describe('Failing to record search information due to DB issue', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        addressesRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having connected to a DB that is now down', () => {
        beforeEach(async () => {
          await db.destroy()
        })

        describe('when attempting to retrieve the address information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              { ip: '127.0.0.1', query: {}, params: { id: 'test-address-id' } },
              res
            )
          })

          it('should retrieve the information of the requested address', () => {
            expect(mempool.addresses.getAddress).toHaveBeenCalledTimes(1)
            expect(mempool.addresses.getAddress.mock.calls[0][0]).toEqual({
              address: 'test-address-id'
            })
          })

          it('should not crash the application and respond with the address information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-address-id',
                balance: 'BTC-1',
                spent: 'BTC-3',
                transactions: 2,
                received: 'BTC-5',
                unspent: 'BTC-1'
              }
            })
          })

          it('should log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(1)

            expect(console.error.mock.calls[0][0]).toBe(
              'Something went wrong while recording the address searches'
            )
          })
        })
      })
    })
  })

  describe('Retrieving the information of an address', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        addressesRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having all services online', () => {
        describe('when attempting to retrieve the address information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              { ip: '127.0.0.1', query: {}, params: { id: 'test-address-id' } },
              res
            )
          })

          it('should retrieve the information of the requested address', () => {
            expect(mempool.addresses.getAddress).toHaveBeenCalledTimes(1)
            expect(mempool.addresses.getAddress.mock.calls[0][0]).toEqual({
              address: 'test-address-id'
            })
          })

          it('should respond with the address information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-address-id',
                balance: 'BTC-1',
                spent: 'BTC-3',
                transactions: 2,
                received: 'BTC-5',
                unspent: 'BTC-1'
              }
            })
          })

          it('should log the search in the DB', async () => {
            const records = await db('address_searches')

            expect(records).toHaveLength(1)
            expect(records[0].address_id).toBe('test-address-id')
          })

          it('should not log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(0)
          })
        })
      })
    })
  })

  describe('Retrieving the information of an address in a non-BTC currency', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        addressesRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having all services online', () => {
        describe('when attempting to retrieve the address information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              {
                ip: '127.0.0.1',
                query: { currency: 'USD' },
                params: { id: 'test-address-id' }
              },
              res
            )
          })

          it('should retrieve the information of the requested address', () => {
            expect(mempool.addresses.getAddress).toHaveBeenCalledTimes(1)
            expect(mempool.addresses.getAddress.mock.calls[0][0]).toEqual({
              address: 'test-address-id'
            })
          })

          it('should respond with the address information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-address-id',
                balance: 'USD-1',
                spent: 'USD-3',
                transactions: 2,
                received: 'USD-5',
                unspent: 'USD-1'
              }
            })
          })

          it('should log the search in the DB', async () => {
            const records = await db('address_searches')

            expect(records).toHaveLength(1)
            expect(records[0].address_id).toBe('test-address-id')
          })

          it('should not log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(0)
          })
        })
      })
    })
  })
})
