'use strict'

module.exports = {
  get name() {
    return 'popular-transactions'
  },

  register: function registerPopularTransaction(info = {}) {
    const { db, app } = info

    app.get('/reports/popular-transactions', async (_, res) => {
      try {
        const data = await db('transaction_searches')
          .select(
            'transaction_id AS id',
            db.raw('CAST(COUNT(ip) AS INTEGER) AS hits')
          )
          .orderBy('hits', 'desc')
          .groupBy('transaction_id')
          .limit(5)

        res.json({
          data,
          total: data.length
        })
      } catch (err) {
        res.status(500)
        res.json({ error: 'Internal Server Error' })

        console.error(
          'Something went wrong while retrieving the popular transactions',
          err
        )
      }
    })
  }
}
