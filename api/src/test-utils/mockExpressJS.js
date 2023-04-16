'use strict'

module.exports = function mockExpressJS() {
  return { get: jest.fn() }
}
