'use strict'

const mempoolJS = require('@mempool/mempool.js')
const createMempool = require('./createMempool')

const mempoolJSObj = {}

jest.mock('@mempool/mempool.js')

describe('Create Mempool Unit Tests', () => {
  beforeEach(() => {
    mempoolJS.mockReturnValue({ bitcoin: mempoolJSObj })
    jest.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    mempoolJS.mockReset()
    console.info.mockRestore()
  })

  describe('Creating a MempoolJS with specific arguments', () => {
    describe('When creating a new MempoolJS with specified arguments', () => {
      let info = null
      let client = null

      beforeEach(() => {
        info = {
          host: 'test-host'
        }

        client = createMempool(info)
      })

      it('should be created with the parameters specified', () => {
        expect(mempoolJS).toHaveBeenCalledTimes(1)

        expect(mempoolJS.mock.calls[0][0]).toEqual({
          host: info.host
        })
      })

      it('should return a MempoolJS', () => {
        expect(client).toBe(mempoolJSObj)
      })
    })
  })

  describe('Creating a MempoolJS without arguments', () => {
    describe('When creating a new MempoolJS without arguments', () => {
      let client = null

      beforeEach(() => {
        client = createMempool()
      })

      it('should be created with the default parameters', () => {
        expect(mempoolJS).toHaveBeenCalledTimes(1)

        expect(mempoolJS.mock.calls[0][0]).toEqual({
          host: 'mempool.space'
        })
      })

      it('should return a MempoolJS', () => {
        expect(client).toBe(mempoolJSObj)
      })
    })
  })
})
