'use strict'

module.exports = {
  get name() {
    return 'transactions'
  },

  register: function registerTransactions(info) {
    const { db, app, rates, mempool } = info

    app.get('/transactions/:id', async (req, res) => {
      const id = req.params.id
      const { currency = 'BTC' } = req.query

      let transaction = null

      try {
        transaction = await mempool.transactions.getTx({ txid: id })
      } catch (err) {
        if ([400, 404].includes(err.response.status)) {
          res.status(err.response.status)
          res.json({ error: err.response.statusText })
        } else {
          res.status(500)
          res.json({ error: 'Internal Server Error' })
        }

        console.error(
          'Something went wrong while retrieving an transaction',
          err
        )

        return
      }

      let tipBlockHeight = null

      try {
        tipBlockHeight = await mempool.blocks.getBlocksTipHeight()
      } catch (err) {
        if ([400, 404].includes(err.response.status)) {
          res.status(err.response.status)
          res.json({ error: err.response.statusText })
        } else {
          res.status(500)
          res.json({ error: 'Internal Server Error' })
        }

        console.error(
          'Something went wrong while retrieving the tip block height',
          err
        )

        return
      }

      try {
        await db('transaction_searches').insert({
          ip: req.ip,
          transaction_id: id
        })
      } catch (err) {
        // This is a non-stopper and should therefore not affect the client.
        console.error(
          'Something went wrong while recording the transaction searches',
          err
        )
      }

      res.json({
        data: {
          id,
          size: transaction.size,
          confirmed: transaction.status.confirmed,
          fees: rates.to(currency, transaction.fee),

          btc_input: rates.to(
            currency,
            transaction.vin.reduce((total, record) => {
              return total + record.prevout.value
            }, 0)
          ),

          btc_output: rates.to(
            currency,
            transaction.vout.reduce((total, record) => {
              return total + record.value
            }, 0)
          ),

          received_time:
            transaction.status.confirmed === false
              ? null
              : transaction.status.block_time * 1000,

          confirmations:
            transaction.status.confirmed === false
              ? null
              : tipBlockHeight - transaction.status.block_height + 1
        }
      })
    })
  }
}
