'use strict'

const axios = require('axios')

const createExchangeRates = require('./createExchangeRates')

jest.mock('axios')

describe('Create Exchange Rates Unit Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()

    jest.spyOn(console, 'info').mockImplementation(() => {})

    axios.get.mockResolvedValue({
      data: {
        BTC: {
          EUR: 2,
          USD: 3
        }
      }
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    console.info.mockRestore()
  })

  describe('Creating Exchange Rates Utility', () => {
    describe('Given that the third party service that the Exchange Rates Utility uses is online', () => {
      describe('When creating the Exchange Rates Utility', () => {
        let rates = null

        beforeEach(async () => {
          rates = await createExchangeRates()
        })

        it('should retrieve the latest currency exchanges', () => {
          expect(axios.get).toHaveBeenCalledTimes(1)
          expect(axios.get).toHaveBeenCalledWith(
            'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,EUR'
          )
        })

        it('should cache the rates', () => {
          expect(rates.eurRate).toBe(2)
          expect(rates.usdRate).toBe(3)
        })
      })
    })
  })

  describe('Failing to create the Exchange Rates Utility due to a third party service issue', () => {
    describe('Given that the third party service that the Exchange Rates Utility uses is offline', () => {
      describe('When creating the Exchange Rates Utility', () => {
        beforeEach(() => {
          axios.get.mockRejectedValue(new Error('test-error'))
        })

        it('should fail the service', async () => {
          await expect(async () => {
            return await createExchangeRates()
          }).rejects.toThrow()
        })
      })
    })
  })

  describe('Refreshing the Exchange Rates', () => {
    describe('Given an Exchange Rates Utility', () => {
      let rates = null

      beforeEach(async () => {
        rates = await createExchangeRates()
      })

      describe('having had some time pass', () => {
        beforeEach(() => {
          axios.get.mockReset()

          axios.get.mockResolvedValue({
            data: {
              BTC: {
                EUR: 3,
                USD: 4
              }
            }
          })

          jest.runOnlyPendingTimers()
        })

        it('should retrieve the latest currency exchanges', () => {
          expect(axios.get).toHaveBeenCalledTimes(1)
          expect(axios.get).toHaveBeenCalledWith(
            'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,EUR'
          )
        })

        it('should cache the rates', () => {
          expect(rates.eurRate).toBe(3)
          expect(rates.usdRate).toBe(4)
        })
      })
    })
  })

  describe('Failing to refresh the Exchange Rates', () => {
    describe('Given an Exchange Rates Utility', () => {
      let rates = null

      beforeEach(async () => {
        rates = await createExchangeRates()
      })

      describe('having had some time pass whilst the third party service went offline', () => {
        beforeEach(() => {
          axios.get.mockReset()

          axios.get.mockRejectedValue(new Error('test-error'))
          jest.spyOn(console, 'error').mockImplementation(() => {})

          jest.runOnlyPendingTimers()
        })

        afterEach(() => {
          console.error.mockRestore()
        })

        it('should attempt to retrieve the latest currency exchanges', () => {
          expect(axios.get).toHaveBeenCalledTimes(1)
          expect(axios.get).toHaveBeenCalledWith(
            'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,EUR'
          )
        })

        it('should not update the cache the rates', () => {
          expect(rates.eurRate).toBe(2)
          expect(rates.usdRate).toBe(3)
        })

        it('should log the error', () => {
          expect(console.error).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('Converting Satoshis to BTC', () => {
    describe('Given an Exchange Rates Utility', () => {
      let rates = null

      beforeEach(async () => {
        rates = await createExchangeRates()
      })

      describe('when converting Satoshis to BTC', () => {
        it('should convert it accordingly', () => {
          expect(rates.toBTC(100000000)).toBe(1)
          expect(rates.to('BTC', 100000000)).toBe(1)
        })
      })
    })
  })

  describe('Converting Satoshis to EUR', () => {
    describe('Given an Exchange Rates Utility', () => {
      let rates = null

      beforeEach(async () => {
        rates = await createExchangeRates()
      })

      describe('when converting Satoshis to EUR', () => {
        it('should convert it accordingly', () => {
          expect(rates.toEUR(100000000)).toBe(2)
          expect(rates.to('EUR', 100000000)).toBe(2)
        })
      })
    })
  })

  describe('Converting Satoshis to USD', () => {
    describe('Given an Exchange Rates Utility', () => {
      let rates = null

      beforeEach(async () => {
        rates = await createExchangeRates()
      })

      describe('when converting Satoshis to USD', () => {
        it('should convert it accordingly', () => {
          expect(rates.toUSD(100000000)).toBe(3)
          expect(rates.to('USD', 100000000)).toBe(3)
        })
      })
    })
  })
})
