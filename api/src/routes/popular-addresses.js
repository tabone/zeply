'use strict'

module.exports = {
  get name() {
    return 'popular-addresses'
  },

  register: function registerPopularAddresses(info = {}) {
    const { db, app } = info

    app.get('/reports/popular-addresses', async (_, res) => {
      try {
        const data = await db('address_searches')
          .select(
            'address_id AS id',
            db.raw('CAST(COUNT(ip) AS INTEGER) AS hits')
          )
          .orderBy('hits', 'desc')
          .groupBy('address_id')
          .limit(5)

        res.json({
          data,
          total: data.length
        })
      } catch (err) {
        res.status(500)
        res.json({ error: 'Internal Server Error' })

        console.error(
          'Something went wrong while retrieving the popular addresses',
          err
        )
      }
    })
  }
}
