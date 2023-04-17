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
import TransactionDialog from './TransactionDialog'

import { actions as ratesActions } from './store/rates'

import AppContext from './AppContext'

const entityID = 'test-btc-trx-id'

describe('<TransactionDialog /> Unit Tests', () => {
  let apiMock = null

  beforeEach(() => {
    apiMock = new MockAdapter(api)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('Rendering an <TransactionDialog /> to show the details of a confirmed BTC Transaction', () => {
    describe('When rendering an <TransactionDialog /> to show the details of a confirmed BTC Transaction', () => {
      beforeEach(async () => {
        apiMock.onGet(`/transactions/${entityID}`).reply(200, {
          data: {
            id: entityID,
            size: 1,
            fees: 2,
            btc_input: 3,
            btc_output: 4,
            confirmed: true,
            confirmations: 5,
            received_time: 1680111667000
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
        expect(getCalls[0].url).toBe(`/transactions/${entityID}`)
      })

      it('should display the expected dialog title', () => {
        expect(
          screen.getByRole('heading', {
            name: 'Transaction test-btc-trx-id'
          })
        ).toBeInTheDocument()
      })

      it('should display the BTC Transaction details accordingly', () => {
        expect(screen.getByLabelText('Size')).toHaveTextContent(1)
        expect(screen.getByLabelText('ID')).toHaveTextContent(entityID)
        expect(screen.getByLabelText('Confirmations')).toHaveTextContent('5')
        expect(screen.getByLabelText('Status')).toHaveTextContent('CONFIRMED')

        expect(screen.getByLabelText('Received Time')).toHaveTextContent(
          '29/03/2023'
        )
        expect(screen.getByLabelText('BTC Input')).toHaveTextContent(
          'BTC-symbol3.0000'
        )
        expect(screen.getByLabelText('BTC Output')).toHaveTextContent(
          'BTC-symbol4.0000'
        )
        expect(screen.getByLabelText('Fees')).toHaveTextContent(
          'BTC-symbol2.0000'
        )
      })
    })
  })

  describe('Rendering an <TransactionDialog /> to show the details of an unconfirmed BTC Transaction', () => {
    describe('When rendering an <TransactionDialog /> to show the details of a unconfirmed BTC Transaction', () => {
      beforeEach(async () => {
        apiMock.onGet(`/transactions/${entityID}`).reply(200, {
          data: {
            id: entityID,
            size: 1,
            fees: 2,
            btc_input: 3,
            btc_output: 4,
            confirmed: false,
            confirmations: null,
            received_time: null
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
        expect(getCalls[0].url).toBe(`/transactions/${entityID}`)
      })

      it('should display the BTC Transaction details accordingly', () => {
        expect(screen.getByLabelText('Size')).toHaveTextContent(1)
        expect(screen.getByLabelText('ID')).toHaveTextContent(entityID)
        expect(screen.getByLabelText('Status')).toHaveTextContent('UNCONFIRMED')

        expect(screen.getByLabelText('BTC Input')).toHaveTextContent(
          'BTC-symbol3.0000'
        )
        expect(screen.getByLabelText('BTC Output')).toHaveTextContent(
          'BTC-symbol4.0000'
        )
        expect(screen.getByLabelText('Fees')).toHaveTextContent(
          'BTC-symbol2.0000'
        )
      })

      it('should not display the fields related to confirmed transactions', () => {
        expect(screen.queryByLabelText('Received Time')).not.toBeInTheDocument()

        expect(screen.queryByLabelText('Confirmations')).not.toBeInTheDocument()
      })
    })
  })

  describe('Rendering an <TransactionDialog /> to show the details of a non-existent BTC Transaction', () => {
    describe('When rendering an <TransactionDialog /> to show the details of a non-existent BTC Transaction', () => {
      beforeEach(async () => {
        apiMock.onGet(`/transactions/${entityID}`).reply(400)

        renderComponent({ entityID })

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe(`/transactions/${entityID}`)
      })

      it('should inform the user that the BTC transaction was not found', () => {
        expect(
          screen.getByText("We couldn't find what you're looking for")
        ).toBeInTheDocument()
      })

      it('should log the error in the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Rendering <TransactionDialog /> and failing to retrieve BTC Transaction due to an API issue', () => {
    describe('When rendering <TransactionDialog /> and failing to retrieve BTC Transaction due to an API issue', () => {
      beforeEach(async () => {
        apiMock.onGet(`/transactions/${entityID}`).reply(500)

        renderComponent({ entityID })

        await waitForElementToBeRemoved(() => {
          return screen.queryByText('Retrieving Data...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe(`/transactions/${entityID}`)
      })

      it('should inform the user about the error', () => {
        expect(
          screen.getByText('An error occured, please try again')
        ).toBeInTheDocument()
      })

      it('should log the error in the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Closing an <TransactionDialog />', () => {
    describe('Given an <TransactionDialog />', () => {
      let onClose = null

      beforeEach(async () => {
        apiMock.onGet(`/transactions/${entityID}`).reply(200, {
          data: {
            id: entityID,
            spent: 1,
            balance: 3,
            unspent: 5,
            received: 2,
            transactions: 4
          }
        })

        onClose = renderComponent({ entityID }).onClose

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

        it('should attempt to close the <TransactionDialog />', () => {
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
        <TransactionDialog entityID={entityID} onClose={onClose} />
      </AppContext.Provider>
    </Provider>
  )

  return { onClose }
}
