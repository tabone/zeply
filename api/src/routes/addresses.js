'use strict'

module.exports = {
  get name() {
    return 'addresses'
  },

  register: function registerAddresses(info) {
    const { db, app, rates, mempool } = info

    app.get('/addresses/:id', async (req, res) => {
      const id = req.params.id
      const { currency = 'BTC' } = req.query

      let address = null

      try {
        address = await mempool.addresses.getAddress({ address: id })
      } catch (err) {
        if ([400, 404].includes(err.response.status)) {
          res.status(err.response.status)
          res.json({ error: err.response.statusText })
        } else {
          res.status(500)
          res.json({ error: 'Internal Server Error' })
        }

        console.error('Something went wrong while retrieving an address', err)

        return
      }

      try {
        await db('address_searches').insert({
          ip: req.ip,
          address_id: id
        })
      } catch (err) {
        // This is a non-stopper and should therefore not affect the client.
        console.error(
          'Something went wrong while recording the address searches',
          err
        )
      }

      const spent = rates.to(currency, address.chain_stats.spent_txo_sum)
      const received = rates.to(currency, address.chain_stats.funded_txo_sum)

      res.json({
        data: {
          id,
          spent,
          received,
          transactions: address.chain_stats.tx_count,
          unspent: rates.to(currency, address.mempool_stats.spent_txo_sum),

          balance: rates.to(
            currency,
            Math.max(
              0,
              address.chain_stats.funded_txo_sum -
                address.chain_stats.spent_txo_sum -
                address.mempool_stats.spent_txo_sum
            )
          )
        }
      })
    })
  }
}
