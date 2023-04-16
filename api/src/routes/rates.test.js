const ratesRoute = require('./rates')

const mockExpressJS = require('../test-utils/mockExpressJS')
const mockExpressJSResponse = require('../test-utils/mockExpressJSResponse')

describe('Rates Unit Tests', () => {
  let app = null
  let rates = null

  beforeEach(async () => {
    app = mockExpressJS()

    rates = {
      get eurDP() {
        return 2
      },
      get usdDP() {
        return 2
      },
      get btcDP() {
        return 8
      },
      get btcRate() {
        return 1
      },
      get eurRate() {
        return 2
      },
      get usdRate() {
        return 3
      }
    }
  })

  describe('Retrieving the name of the route', () => {
    describe('Given a route', () => {
      describe('when getting the name of the route', () => {
        it('should return the expected name', () => {
          expect(ratesRoute.name).toBe('rates')
        })
      })
    })
  })

  describe('Registering the route', () => {
    describe('Given an ExpressJS Application', () => {
      describe('when registering the route', () => {
        beforeEach(() => {
          ratesRoute.register({ app })
        })

        it('should be registered once and in the correct endpoint', () => {
          expect(app.get).toHaveBeenCalledTimes(1)
          expect(app.get.mock.calls[0][0]).toBe('/rates')
        })
      })
    })
  })

  describe('Retrieving the rates', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        ratesRoute.register({ app, rates })
        middleware = app.get.mock.calls[0][1]
      })

      describe('when attempting to retrieve the rates', () => {
        let res = null

        beforeEach(async () => {
          res = mockExpressJSResponse()
          await middleware({}, res)
        })

        it('should respond with the rates', () => {
          expect(res.json).toHaveBeenCalledTimes(1)
          expect(res.status).toHaveBeenCalledTimes(0)

          expect(res.json.mock.calls[0][0]).toEqual({
            data: [
              {
                id: 'BTC',
                symbol: '₿',
                name: 'Bitcoin',
                dp: 8,
                rate: 1
              },
              {
                id: 'EUR',
                symbol: '€',
                name: 'Euro',
                dp: 2,
                rate: 2
              },
              {
                id: 'USD',
                symbol: '$',
                name: 'US Dollar',
                dp: 2,
                rate: 3
              }
            ]
          })
        })
      })
    })
  })
})
