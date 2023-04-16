import React from 'react'

import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'

import BTC from './BTC'
import Field from './Field'
import store from './store'

import AppContext from './AppContext'

import { actions as ratesActions } from './store/rates'

describe('<BTC /> Unit Tests', () => {
  describe('Rendering <BTC /> while currency is set to BTC', () => {
    describe('Given an app that is showing the monetary amounts in BTC', () => {
      describe('when rendering a monetary value using <BTC />', () => {
        beforeEach(() => {
          renderComponent({ value: 1, currency: 'BTC' })
        })

        it('should render the monetary amount with the expected rate', () => {
          expect(screen.getByLabelText('test-btc')).toHaveTextContent(
            'BTC-symbol1.0000'
          )
        })
      })
    })
  })

  describe('Rendering <BTC /> while currency is set to EUR', () => {
    describe('Given an app that is showing the monetary amounts in EUR', () => {
      describe('when rendering a monetary value using <BTC />', () => {
        beforeEach(() => {
          renderComponent({ value: 1, currency: 'EUR' })
        })

        it('should render the monetary amount with the expected rate', () => {
          expect(screen.getByLabelText('test-btc')).toHaveTextContent(
            'EUR-symbol2.0000'
          )
        })
      })
    })
  })

  describe('Rendering <BTC /> while currency is set to USD', () => {
    describe('Given an app that is showing the monetary amounts in USD', () => {
      describe('when rendering a monetary value using <BTC />', () => {
        beforeEach(() => {
          renderComponent({ value: 1, currency: 'USD' })
        })

        it('should render the monetary amount with the expected rate', () => {
          expect(screen.getByLabelText('test-btc')).toHaveTextContent(
            'USD-symbol3.0000'
          )
        })
      })
    })
  })
})

function renderComponent(info = {}) {
  const {
    value,
    currency = 'BTC',
    rates = ['BTC', 'EUR', 'USD'].map((currency, index) => {
      return {
        id: currency,
        dp: 4,
        name: currency,
        rate: index + 1,
        symbol: `${currency}-symbol`
      }
    })
  } = info

  store.dispatch(ratesActions.add(...rates))

  render(
    <Provider store={store}>
      <AppContext.Provider value={{ currency }}>
        <Field label="test-btc">
          <BTC value={value} />
        </Field>
      </AppContext.Provider>
    </Provider>
  )
}
