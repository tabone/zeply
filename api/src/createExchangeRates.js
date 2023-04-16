'use strict'

const axios = require('axios')

const currencies = {
  EUR: 0,
  USD: 0
}

async function refreshCurrencies() {
  const response = await axios.get(
    'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,EUR'
  )

  currencies.EUR = response.data.BTC.EUR
  currencies.USD = response.data.BTC.USD
}

module.exports = async function createExchangeRates() {
  global.setInterval(async () => {
    try {
      await refreshCurrencies()
      console.info('Refreshed Exchange Rates', currencies)
    } catch (err) {
      console.error(
        'Something wrong happened while refreshing the currencies',
        err
      )
    }
  }, 60 * 60 * 1000)

  // First refresh should stop the API from starting.
  try {
    await refreshCurrencies()
  } catch (e) {
    throw new Error(
      'An error occured while retrieving the exchange rates for the first time'
    )
  }

  console.info('Setup Exchange Rates', currencies)

  return Object.freeze({
    get btcRate() {
      return 0.00000001
    },

    get eurRate() {
      return currencies.EUR
    },

    get usdRate() {
      return currencies.USD
    },

    get eurDP() {
      return 2
    },

    get usdDP() {
      return 2
    },

    get btcDP() {
      return 8
    },

    toBTC(satoshis = 0) {
      return Number((satoshis * this.btcRate).toFixed(this.btcDP))
    },

    toEUR(satoshis = 0) {
      return Number((this.toBTC(satoshis) * this.eurRate).toFixed(this.eurDP))
    },

    toUSD(satoshis = 0) {
      return Number((this.toBTC(satoshis) * this.usdRate).toFixed(this.usdDP))
    },

    to(currency, satoshis = 0) {
      switch (`${currency}`.toUpperCase()) {
        case 'EUR':
          return this.toEUR(satoshis)
        case 'USD':
          return this.toUSD(satoshis)
        default:
          return this.toBTC(satoshis)
      }
    }
  })
}
