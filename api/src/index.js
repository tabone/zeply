'use strict'

const createDB = require('./createDB')
const createServer = require('./createServer')
const createMempool = require('./createMempool')
const createExchangeRates = require('./createExchangeRates')

module.exports = async function start(info) {
  const { db, mempool, port } = info

  const server = createServer({
    db: createDB(db),
    rates: await createExchangeRates(),
    mempool: createMempool(mempool)
  })

  server.listen(port, () => {
    console.info(`Listening on port ${port}`)
  })
}
