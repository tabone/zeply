import React from 'react'

import { Provider } from 'react-redux'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'

import Topbar from './Topbar'
import store from './store'

import AppContext from './AppContext'

import { actions as ratesActions } from './store/rates'

describe('<BTC /> Unit Tests', () => {
  describe('Rendering the <Topbar />', () => {
    describe('When rendering the <Topbar />', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should inform the user with the current selected currency', () => {
        expect(screen.getByLabelText('Current Currency')).toHaveTextContent(
          'BTC'
        )
      })
    })
  })

  describe('Changing the currency from <Topbar />', () => {
    describe('Given a <Topbar />', () => {
      let onCurrencyChange = null

      beforeEach(() => {
        const info = renderComponent()
        onCurrencyChange = info.onCurrencyChange
      })

      describe('when changing the Currency', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(screen.getByLabelText('Current Currency'))
          )

          await act(() => userEvent.click(screen.getByText('EUR')))
        })

        it('should attempt to change the currency', () => {
          expect(onCurrencyChange).toHaveBeenCalledTimes(1)
          expect(onCurrencyChange.mock.calls[0][0]).toBe('EUR')
        })
      })
    })
  })
})

function renderComponent(info = {}) {
  const {
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

  const onCurrencyChange = jest.fn()

  store.dispatch(ratesActions.add(...rates))

  render(
    <Provider store={store}>
      <AppContext.Provider value={{ currency, onCurrencyChange }}>
        <Topbar />
      </AppContext.Provider>
    </Provider>
  )

  return { onCurrencyChange }
}
