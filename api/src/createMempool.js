'use strict'

const mempoolJS = require('@mempool/mempool.js')

module.exports = function createMempool(info = {}) {
  const { host = 'mempool.space' } = info

  console.info('Setup MempoolJS', { host })

  return mempoolJS({
    host
  }).bitcoin
}
