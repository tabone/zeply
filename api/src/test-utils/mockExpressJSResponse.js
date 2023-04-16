'use strict'

module.exports = function mockExpressResponse() {
  return { status: jest.fn(), json: jest.fn() }
}
