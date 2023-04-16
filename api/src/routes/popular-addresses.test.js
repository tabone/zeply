'use strict'

const knex = require('knex')

const mockExpressJS = require('../test-utils/mockExpressJS')
const mockExpressJSResponse = require('../test-utils/mockExpressJSResponse')

const popularAddressesRoute = require('./popular-addresses')

describe('Popular Addresses Unit Tests', () => {
  let db = null
  let app = null

  beforeEach(async () => {
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
          ip          INET        NOT NULL,
          created     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `
    )

    app = mockExpressJS()
  })

  afterEach(async () => {
    await db.destroy()
  })

  describe('Retrieving the name of the route', () => {
    describe('Given a route', () => {
      describe('when getting the name of the route', () => {
        it('should return the expected name', () => {
          expect(popularAddressesRoute.name).toBe('popular-addresses')
        })
      })
    })
  })

  describe('Registering the route', () => {
    describe('Given an ExpressJS Application', () => {
      describe('when registering the route', () => {
        beforeEach(() => {
          popularAddressesRoute.register({ db, app })
        })

        it('should be registered once and in the correct endpoint', () => {
          expect(app.get).toHaveBeenCalledTimes(1)
          expect(app.get.mock.calls[0][0]).toBe('/reports/popular-addresses')
        })
      })
    })
  })

  describe('Retrieving the popular addresses when there is no address search history', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        popularAddressesRoute.register({ db, app })
        middleware = app.get.mock.calls[0][1]
      })

      describe('having a DB that has no address history', () => {
        describe('when retrieving the popular addresses', () => {
          it('should return the expected response', async () => {
            const res = mockExpressJSResponse()

            await middleware(null, res)

            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json.mock.calls[0][0]).toEqual({
              data: [],
              total: 0
            })
          })
        })
      })
    })
  })

  describe('Retrieving the popular addresses when there is less than 5 address search history entries', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        popularAddressesRoute.register({ db, app })
        middleware = app.get.mock.calls[0][1]
      })

      describe('having a DB that has less than 5 address search history entries', () => {
        beforeEach(async () => {
          await Promise.all(
            Array(3)
              .fill()
              .reduce((promises, _, index) => {
                for (let hit = 0; hit < index + 1; hit++) {
                  promises.push(
                    db('address_searches').insert({
                      ip: '127.0.0.1',
                      address_id: `address${index}`
                    })
                  )
                }

                return promises
              }, [])
          )
        })

        describe('when retrieving the popular addresses', () => {
          it('should return the expected response', async () => {
            const res = mockExpressJSResponse()

            await middleware(null, res)

            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json.mock.calls[0][0]).toEqual({
              total: 3,
              data: [
                {
                  hits: 3,
                  id: 'address2'
                },
                {
                  hits: 2,
                  id: 'address1'
                },
                {
                  hits: 1,
                  id: 'address0'
                }
              ]
            })
          })
        })
      })
    })
  })

  describe('Retrieving the popular addresses when there is 5 address search history entries', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        popularAddressesRoute.register({ db, app })
        middleware = app.get.mock.calls[0][1]
      })

      describe('having a DB that has 5 address search history entries', () => {
        beforeEach(async () => {
          await Promise.all(
            Array(5)
              .fill()
              .reduce((promises, _, index) => {
                for (let hit = 0; hit < index + 1; hit++) {
                  promises.push(
                    db('address_searches').insert({
                      ip: '127.0.0.1',
                      address_id: `address${index}`
                    })
                  )
                }

                return promises
              }, [])
          )
        })

        describe('when retrieving the popular addresses', () => {
          it('should return the expected response', async () => {
            const res = mockExpressJSResponse()

            await middleware(null, res)

            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json.mock.calls[0][0]).toEqual({
              total: 5,
              data: [
                {
                  hits: 5,
                  id: 'address4'
                },
                {
                  hits: 4,
                  id: 'address3'
                },
                {
                  hits: 3,
                  id: 'address2'
                },
                {
                  hits: 2,
                  id: 'address1'
                },
                {
                  hits: 1,
                  id: 'address0'
                }
              ]
            })
          })
        })
      })
    })
  })

  describe('Retrieving the popular addresses when there is more than 5 address search history entries', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        popularAddressesRoute.register({ db, app })
        middleware = app.get.mock.calls[0][1]
      })

      describe('having a DB that has more than 5 address search history entries', () => {
        beforeEach(async () => {
          await Promise.all(
            Array(10)
              .fill()
              .reduce((promises, _, index) => {
                for (let hit = 0; hit < index + 1; hit++) {
                  promises.push(
                    db('address_searches').insert({
                      ip: '127.0.0.1',
                      address_id: `address${index}`
                    })
                  )
                }

                return promises
              }, [])
          )
        })

        describe('when retrieving the popular addresses', () => {
          it('should return the expected response', async () => {
            const res = mockExpressJSResponse()

            await middleware(null, res)

            expect(res.json).toHaveBeenCalledTimes(1)
            expect(res.json.mock.calls[0][0]).toEqual({
              total: 5,
              data: [
                {
                  hits: 10,
                  id: 'address9'
                },
                {
                  hits: 9,
                  id: 'address8'
                },
                {
                  hits: 8,
                  id: 'address7'
                },
                {
                  hits: 7,
                  id: 'address6'
                },
                {
                  hits: 6,
                  id: 'address5'
                }
              ]
            })
          })
        })
      })
    })
  })

  describe('Failing to retrieve popular addresses due to DB issue', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})

        popularAddressesRoute.register({ db, app })
        middleware = app.get.mock.calls[0][1]
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      describe('having been disconnected from the DB', () => {
        beforeEach(async () => {
          await db.destroy()
        })

        describe('when attempting to retrieve the popular addresses', () => {
          let res = null

          beforeEach(async () => {
            res = mockExpressJSResponse()
            await middleware(null, res)
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
              'Something went wrong while retrieving the popular addresses'
            )
          })
        })
      })
    })
  })
})
