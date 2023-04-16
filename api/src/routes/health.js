'use strict'

module.exports = {
  get name() {
    return 'health'
  },

  register: function registerPopularAddresses(info = {}) {
    const { app } = info

    app.get('/health', async (_, res) => {
      res.json({ okay: true })
    })
  }
}
