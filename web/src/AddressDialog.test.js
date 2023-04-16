import React from 'react'

import { Set } from 'immutable'
import { Provider } from 'react-redux'
import MockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react'

import store from './store'
import api from './axios/api'
import AddressDialog from './AddressDialog'

import { actions as ratesActions } from './store/rates'

import AppContext from './AppContext'

const entityID = 'test-btc-addr-id'

describe('<AddressDialog /> Unit Tests', () => {
  let apiMock = null

  beforeEach(() => {
    apiMock = new MockAdapter(api)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('Rendering an <AddressDialog /> to show the details of a BTC Address', () => {
    describe('When rendering an <AddressDialog /> to show the details of a BTC Address', () => {
      beforeEach(async () => {
        apiMock.onGet(`/addresses/${entityID}`).reply(200, {
          data: {
            id: entityID,
            spent: 1,
            balance: 3,
            unspent: 5,
            received: 2,
            transactions: 4
          }
        })

        renderComponent({ entityID })

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe(`/addresses/${entityID}`)
      })

      it('should display the BTC Address details accordingly', () => {
        expect(screen.getByLabelText('Spent')).toHaveTextContent(
          'BTC-symbol1.0000'
        )

        expect(
          screen.getByLabelText('Confirmed Transactions')
        ).toHaveTextContent('4')

        expect(screen.getByLabelText('Recieved')).toHaveTextContent(
          'BTC-symbol2.0000'
        )

        expect(screen.getByLabelText('Unspent')).toHaveTextContent(
          'BTC-symbol5.0000'
        )
        expect(screen.getByLabelText('Balance')).toHaveTextContent(
          'BTC-symbol3.0000'
        )
      })
    })
  })

  describe('Rendering an <AddressDialog /> to show the details of a non-existent BTC Address', () => {
    describe('When rendering an <AddressDialog /> to show the details of a non-existent BTC Address', () => {
      beforeEach(async () => {
        apiMock.onGet(`/addresses/${entityID}`).reply(400)

        renderComponent({ entityID })

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe(`/addresses/${entityID}`)
      })

      it('should inform the user that the BTC address was not found', () => {
        expect(
          screen.getByText("We couldn't find what you're looking for")
        ).toBeInTheDocument()
      })

      it('should log the error in the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Rendering <AddressDialog /> and failing to retrieve BTC Address due to an API issue', () => {
    describe('When rendering <AddressDialog /> and failing to retrieve BTC Address due to an API issue', () => {
      beforeEach(async () => {
        apiMock.onGet(`/addresses/${entityID}`).reply(500)

        renderComponent({ entityID })

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe(`/addresses/${entityID}`)
      })

      it('should inform the user that the BTC address was not found', () => {
        expect(
          screen.getByText('An error occured, please try again')
        ).toBeInTheDocument()
      })

      it('should log the error in the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Closing an <AddressDialog />', () => {
    describe('Given an <AddressDialog />', () => {
      let onClose = null

      beforeEach(async () => {
        apiMock.onGet(`/addresses/${entityID}`).reply(200, {
          data: {
            id: entityID,
            spent: 1,
            balance: 3,
            unspent: 5,
            received: 2,
            transactions: 4
          }
        })

        const info = renderComponent({ entityID })
        onClose = info.onClose

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      describe('when clicking on the close icon', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(
              screen.getByRole('button', {
                name: 'Close'
              })
            )
          )
        })

        it('should attempt to close the <AddressDialog />', () => {
          expect(onClose).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})

function renderComponent(info = {}) {
  const { entityID } = info

  const onClose = jest.fn()

  store.dispatch(
    ratesActions.add(
      ...['BTC', 'EUR', 'USD'].map((currency, index) => {
        return {
          id: currency,
          dp: 4,
          name: currency,
          rate: index + 1,
          symbol: `${currency}-symbol`
        }
      })
    )
  )

  render(
    <Provider store={store}>
      <AppContext.Provider
        value={{
          currency: 'BTC',
          addressesSubscriptions: new Set(),
          transactionsSubscriptions: new Set()
        }}>
        <AddressDialog entityID={entityID} onClose={onClose} />
      </AppContext.Provider>
    </Provider>
  )

  return { onClose }
}
