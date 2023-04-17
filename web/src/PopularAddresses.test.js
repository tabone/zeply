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
import PopularAddresses from './PopularAddresses'

describe('<PopularAddresses /> Unit Tests', () => {
  let apiMock = null

  beforeEach(() => {
    apiMock = new MockAdapter(api)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('Rendering <PopularAddresses /> when there is no search history data', () => {
    describe('When rendering the <PopularAddresses /> when there is no search history data', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-addresses').reply(200, {
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
        expect(getCalls[0].url).toBe('/reports/popular-addresses')
      })

      it('should inform the user that there is no data', () => {
        expect(screen.getByText('No Data')).toBeInTheDocument()
      })
    })
  })

  describe('Rendering <PopularAddresses /> when there is search history data', () => {
    describe('When rendering the <PopularAddresses /> when there is search history data', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-addresses').reply(200, {
          data: [
            {
              id: '3AxV6siP48xGAFosUmxQE4EzXZbFQFZr2y',
              hits: 10
            },
            {
              id: '3QNjySqkGpARGgWh6p1a7pkaJ9MLbdhVFW',
              hits: 5
            },
            {
              id: '35Ztey5KbNrS8jPz8ERmo3MgrwsR8Ucj5L',
              hits: 7
            },
            {
              id: '3PqVKeEn1WbW9fKYuEAYMyEbKg3tgbrnfi',
              hits: 2
            },
            {
              id: '3B9eWx7HvjCd7h8w6GDAT3HKN7PWULCabC',
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
        expect(getCalls[0].url).toBe('/reports/popular-addresses')
      })

      it('should list the transactions in order', () => {
        const items = screen.getAllByRole('listitem')

        const entities = [
          '3B9eWx7H ... PWULCabC',
          '3AxV6siP ... bFQFZr2y',
          '35Ztey5K ... sR8Ucj5L',
          '3QNjySqk ... MLbdhVFW',
          '3PqVKeEn ... 3tgbrnfi'
        ]

        items.forEach((item, index) => {
          expect(within(item).getByText(entities[index])).toBeInTheDocument()
        })
      })
    })
  })

  describe('Failing to render <PopularAddresses /> due to an API error', () => {
    describe('When failing to the <PopularAddresses /> due to an API error', () => {
      beforeEach(async () => {
        apiMock.onGet('/reports/popular-addresses').reply(500)

        renderComponent()

        await waitForElementToBeRemoved(() => {
          return screen.queryByLabelText('Loading...')
        })
      })

      it('should make the expected HTTP Request', () => {
        const getCalls = apiMock.history.get

        expect(getCalls).toHaveLength(1)
        expect(getCalls[0].url).toBe('/reports/popular-addresses')
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
            'An error occured while retrieving the popular addresses'
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
        <PopularAddresses />
      </SnackbarProvider>
    </Provider>
  )
}
