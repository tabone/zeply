'use strict'

module.exports = {
  get name() {
    return 'rates'
  },

  register: function registerPopularAddresses(info = {}) {
    const { rates, app } = info

    app.get('/rates', async (_, res) => {
      res.json({
        data: [
          {
            id: 'BTC',
            symbol: '₿',
            name: 'Bitcoin',
            dp: rates.btcDP,
            rate: 1
          },
          {
            id: 'EUR',
            symbol: '€',
            name: 'Euro',
            dp: rates.eurDP,
            rate: rates.eurRate
          },
          {
            id: 'USD',
            symbol: '$',
            name: 'US Dollar',
            dp: rates.usdDP,
            rate: rates.usdRate
          }
        ]
      })
    })
  }
}
