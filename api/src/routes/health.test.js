const healthRoute = require('./health')

const mockExpressJS = require('../test-utils/mockExpressJS')
const mockExpressJSResponse = require('../test-utils/mockExpressJSResponse')

describe('Health Unit Tests', () => {
  let app = null

  beforeEach(async () => {
    app = mockExpressJS()
  })

  describe('Retrieving the name of the route', () => {
    describe('Given a route', () => {
      describe('when getting the name of the route', () => {
        it('should return the expected name', () => {
          expect(healthRoute.name).toBe('health')
        })
      })
    })
  })

  describe('Registering the route', () => {
    describe('Given an ExpressJS Application', () => {
      describe('when registering the route', () => {
        beforeEach(() => {
          healthRoute.register({ app })
        })

        it('should be registered once and in the correct endpoint', () => {
          expect(app.get).toHaveBeenCalledTimes(1)
          expect(app.get.mock.calls[0][0]).toBe('/health')
        })
      })
    })
  })

  describe('Retrieving the status', () => {
    describe('Given an ExpressJS Application', () => {
      let middleware = null

      beforeEach(() => {
        healthRoute.register({ app })
        middleware = app.get.mock.calls[0][1]
      })

      describe('when attempting to retrieve the health', () => {
        let res = null

        beforeEach(async () => {
          res = mockExpressJSResponse()
          await middleware({}, res)
        })

        it('should respond with the correct payload', () => {
          expect(res.json).toHaveBeenCalledTimes(1)
          expect(res.status).toHaveBeenCalledTimes(0)

          expect(res.json.mock.calls[0][0]).toEqual({
            okay: true
          })
        })
      })
    })
  })
})
