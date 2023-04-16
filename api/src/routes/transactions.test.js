'use strict'

const knex = require('knex')

const mockExpressJS = require('../test-utils/mockExpressJS')
const mockExpressJSResponse = require('../test-utils/mockExpressJSResponse')

const transactionsRoute = require('./transactions')

describe('Transactions Unit Tests', () => {
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
      blocks: {
        getBlocksTipHeight: jest.fn(() => {
          return 100
        })
      },

      transactions: {
        getTx: jest.fn(() => {
          return Promise.resolve({
            fee: 1,
            size: 2,
            status: {
              confirmed: true,
              block_height: 89,
              block_time: 1435754650
            },
            vout: [{ value: 5 }, { value: 2 }, { value: 1 }],
            vin: [{ prevout: { value: 1 } }, { prevout: { value: 5 } }]
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
        CREATE TABLE transaction_searches (
          transaction_id  VARCHAR(64) NOT NULL,
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
          expect(transactionsRoute.name).toBe('transactions')
        })
      })
    })
  })

  describe('Registering the route', () => {
    describe('Given an ExpressJS Application', () => {
      describe('when registering the route', () => {
        beforeEach(() => {
          transactionsRoute.register({ db, app, rates, app })
        })

        it('should be registered once and in the correct endpoint', () => {
          expect(app.get).toHaveBeenCalledTimes(1)
          expect(app.get.mock.calls[0][0]).toBe('/transactions/:id')
        })
      })
    })
  })

  describe('Failing to retrieve transaction information from third party API', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        mempool.transactions.getTx = jest.fn(() => {
          return Promise.reject({
            response: {
              status: 418,
              statusText: 'test-error'
            }
          })
        })

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having connected to a third party API that is currently down', () => {
        describe('when attempting to retrieve the transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              {
                query: {},
                ip: '127.0.0.1',
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should attempt retrieve the information of the requested transaction', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should not crash the application and respond with the appropriate error', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)

            expect(res.status.mock.calls[0][0]).toBe(500)
            expect(res.json.mock.calls[0][0]).toEqual({
              error: 'Internal Server Error'
            })
          })

          it('should log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(1)

            expect(console.error.mock.calls[0][0]).toBe(
              'Something went wrong while retrieving an transaction'
            )
          })
        })
      })
    })
  })

  describe('Failing to retrieve tip block height information from third party API', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        mempool.blocks.getBlocksTipHeight = jest.fn(() => {
          return Promise.reject({
            response: {
              status: 418,
              statusText: 'test-error'
            }
          })
        })

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having connected to a third party API that is currently down', () => {
        describe('when attempting to retrieve the transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              {
                query: {},
                ip: '127.0.0.1',
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should attempt retrieve the tip block height', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should not crash the application and respond with the appropriate error', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(1)

            expect(res.status.mock.calls[0][0]).toBe(500)
            expect(res.json.mock.calls[0][0]).toEqual({
              error: 'Internal Server Error'
            })
          })

          it('should log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(1)

            expect(console.error.mock.calls[0][0]).toBe(
              'Something went wrong while retrieving the tip block height'
            )
          })
        })
      })
    })
  })

  describe('Failing to record serach information due to DB issue', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having connected to a DB that is now down', () => {
        beforeEach(async () => {
          await db.destroy()
        })

        describe('when attempting to retrieve the transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(
              {
                ip: '127.0.0.1',
                query: {},
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should retrieve the information of the requested transaction', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should not crash the application and respond with the transaction information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-transaction-id',
                size: 2,
                fees: 'BTC-1',
                confirmed: true,
                confirmations: 12,
                btc_input: 'BTC-6',
                btc_output: 'BTC-8',
                received_time: 1435754650000
              }
            })
          })

          it('should log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(1)

            expect(console.error.mock.calls[0][0]).toBe(
              'Something went wrong while recording the transaction searches'
            )
          })
        })
      })
    })
  })

  describe('Retrieving a confirmed transaction', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having all services online', () => {
        describe('when attempting to retrieve the confirmed transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()

            await middleware(
              {
                ip: '127.0.0.1',
                query: {},
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should retrieve the information of the requested transaction', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should respond with the transaction information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-transaction-id',
                size: 2,
                fees: 'BTC-1',
                confirmed: true,
                confirmations: 12,
                btc_input: 'BTC-6',
                btc_output: 'BTC-8',
                received_time: 1435754650000
              }
            })
          })

          it('should log the search in the DB', async () => {
            const records = await db('transaction_searches')

            expect(records).toHaveLength(1)
            expect(records[0].transaction_id).toBe('test-transaction-id')
          })

          it('should not log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(0)
          })
        })
      })
    })
  })

  describe('Retrieving an unconfirmed transaction', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        mempool.transactions.getTx = jest.fn(() => {
          return Promise.resolve({
            fee: 1,
            size: 2,
            status: { confirmed: false },
            vout: [{ value: 5 }, { value: 2 }, { value: 1 }],
            vin: [{ prevout: { value: 1 } }, { prevout: { value: 5 } }]
          })
        })

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having all services online', () => {
        describe('when attempting to retrieve the unconfirmed transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()

            await middleware(
              {
                ip: '127.0.0.1',
                query: {},
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should retrieve the information of the requested transaction', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should respond with the transaction information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-transaction-id',
                size: 2,
                fees: 'BTC-1',
                confirmed: false,
                confirmations: null,
                btc_input: 'BTC-6',
                btc_output: 'BTC-8',
                received_time: null
              }
            })
          })

          it('should log the search in the DB', async () => {
            const records = await db('transaction_searches')

            expect(records).toHaveLength(1)
            expect(records[0].transaction_id).toBe('test-transaction-id')
          })

          it('should not log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(0)
          })
        })
      })
    })
  })

  describe('Retrieving a transaction details in a non-BTC currency', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        transactionsRoute.register({ db, app, rates, mempool })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having all services online', () => {
        describe('when attempting to retrieve the confirmed transaction information', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()

            await middleware(
              {
                ip: '127.0.0.1',
                query: { currency: 'USD' },
                params: { id: 'test-transaction-id' }
              },
              res
            )
          })

          it('should retrieve the information of the requested transaction', () => {
            expect(mempool.transactions.getTx).toHaveBeenCalledTimes(1)
            expect(mempool.transactions.getTx.mock.calls[0][0]).toEqual({
              txid: 'test-transaction-id'
            })
          })

          it('should respond with the transaction information', () => {
            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledTimes(0)

            expect(res.json.mock.calls[0][0]).toEqual({
              data: {
                id: 'test-transaction-id',
                size: 2,
                fees: 'USD-1',
                confirmed: true,
                confirmations: 12,
                btc_input: 'USD-6',
                btc_output: 'USD-8',
                received_time: 1435754650000
              }
            })
          })

          it('should log the search in the DB', async () => {
            const records = await db('transaction_searches')

            expect(records).toHaveLength(1)
            expect(records[0].transaction_id).toBe('test-transaction-id')
          })

          it('should not log the error to the console', () => {
            expect(console.error).toHaveBeenCalledTimes(0)
          })
        })
      })
    })
  })
})
