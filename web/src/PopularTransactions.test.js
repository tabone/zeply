import React from 'react'

import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import MockAdapter from 'axios-mock-adapter'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react'

import store from './store'
import api from './axios/api'
import PopularTransactions from './PopularTransactions'

describe('<PopularTransactions /> Unit Tests', () => {
  let apiMock = null

  beforeEach(() => {
    apiMock = new MockAdapter(api)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('Rendering <PopularTransactions /> when there is no search history data', () => {
    describe('When rendering the <PopularTransactions /> when there is no search history data', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-transactions').reply(200, {
          data: []
        })

        renderComponent()

        await waitForElementToBeRemoved(() => {
          return screen.queryByLabelText('Loading...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe('/reports/popular-transactions')
      })

      it('should inform the user that there is no data', () => {
        expect(screen.getByText('No Data')).toBeInTheDocument()
      })
    })
  })

  describe('Rendering <PopularTransactions /> when there is search history data', () => {
    describe('When rendering the <PopularTransactions /> when there is no search history data', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-transactions').reply(200, {
          data: [
            {
              id: 'b140b3ee011ce142dc36b55c593dda85f344f76213afe3893a52d593a1bcfe33',
              hits: 10
            },
            {
              id: 'daf5f37e0e9e6a2e6b3ea27da804fbeb82793f219d1b2da9369fa3a4b72cf5aa',
              hits: 5
            },
            {
              id: '842118eb0752570ea0debef9c14481372a79142584ef768359a08b1454657977',
              hits: 7
            },
            {
              id: 'd4b70dcbb712ab4ac84f9fb24a1b16657a749e28fd27c80afcd0827d58b54ce7',
              hits: 2
            },
            {
              id: '1bac695f03b47f807d40ca4a0b7b9833e8a9ee904b9e9f82514429fb4b01f79d',
              hits: 53
            }
          ]
        })

        renderComponent()

        await waitForElementToBeRemoved(() => {
          return screen.queryByLabelText('Loading...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe('/reports/popular-transactions')
      })

      it('should list the transactions in order', () => {
        const items = screen.getAllByRole('listitem')

        const entities = [
          '1bac695f ... 4b01f79d',
          'b140b3ee ... a1bcfe33',
          '842118eb ... 54657977',
          'daf5f37e ... b72cf5aa',
          'd4b70dcb ... 58b54ce7'
        ]

        items.forEach((item, index) => {
          expect(within(item).getByText(entities[index])).toBeInTheDocument()
        })
      })
    })
  })

  describe('Failing to render <PopularTransactions /> due to an API error', () => {
    describe('When failing to the <PopularTransactions /> due to an API error', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-transactions').reply(500)

        renderComponent()

        await waitForElementToBeRemoved(() => {
          return screen.queryByLabelText('Loading...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe('/reports/popular-transactions')
      })

      it('should inform the user that there is no data', () => {
        expect(screen.getByText('No Data')).toBeInTheDocument()
      })

      it('should log the error to the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })

      it('should inform the user about the error', () => {
        expect(
          screen.getByText(
            'An error occured while retrieving the popular transactions'
          )
        ).toBeInTheDocument()
      })
    })
  })
})

function renderComponent() {
  render(
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={null}>
        <PopularTransactions />
      </SnackbarProvider>
    </Provider>
  )
}
