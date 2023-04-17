import React from 'react'

import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'

import HomeSearch from './HomeSearch'

import AppContext from './AppContext'
import entityTypes from './data/entity-types'

describe('<HomeSearch /> Unit Tests', () => {
  describe('Searching with an invalid BTC Address', () => {
    describe('Given a <HomeSearch /> component', () => {
      beforeEach(() => {
        renderComponent()
      })

      describe('when searching with an invalid BTC Address', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.type(
              screen.getByRole('textbox', { name: 'SEARCH' }),
              'test-invalid-btc-address'
            )
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Address' }))
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Search' }))
          )
        })

        it('should inform the user that the BTC Address is invalid', () => {
          expect(
            screen.getByText(
              "Sorry, we couldn't recognize the BTC address you entered. Please verify that it is correct and try again."
            )
          ).toBeInTheDocument()
        })
      })
    })
  })

  describe('Searching with an invalid BTC Transaction', () => {
    describe('Given a <HomeSearch /> component', () => {
      beforeEach(() => {
        renderComponent()
      })

      describe('when searching with an invalid BTC Transaction', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.type(
              screen.getByRole('textbox', { name: 'SEARCH' }),
              'test-invalid-btc-transaction'
            )
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Transaction' }))
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Search' }))
          )
        })

        it('should inform the user that the BTC Transaction is invalid', () => {
          expect(
            screen.getByText(
              "Sorry, we couldn't recognize the BTC transaction you entered. Please verify that it is correct and try again."
            )
          ).toBeInTheDocument()
        })
      })
    })
  })

  describe('Searching with an valid P2PKH BTC Address', () => {
    describe('Given a <HomeSearch /> component', () => {
      let onEntityChange = null

      beforeEach(() => {
        const info = renderComponent()
        onEntityChange = info.onEntityChange
      })

      describe('when searching with an valid P2PKH BTC Address', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.type(
              screen.getByRole('textbox', { name: 'SEARCH' }),
              '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
            )
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Address' }))
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Search' }))
          )
        })

        it('should attempt to load the BTC Address information', () => {
          expect(onEntityChange).toHaveBeenCalledTimes(1)
          expect(onEntityChange.mock.calls[0][0]).toEqual({
            type: entityTypes.ADDRESS,
            id: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
          })
        })
      })
    })
  })

  describe('Searching with an valid P2WPKH BTC Address', () => {
    describe('Given a <HomeSearch /> component', () => {
      let onEntityChange = null

      beforeEach(() => {
        const info = renderComponent()
        onEntityChange = info.onEntityChange
      })

      describe('when searching with an valid P2WPKH BTC Address', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.type(
              screen.getByRole('textbox', { name: 'SEARCH' }),
              'bc1q2npx7vht0zdj94qh7eeu8l8v75euv39jytcxw7'
            )
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Address' }))
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Search' }))
          )
        })

        it('should attempt to load the BTC Address information', () => {
          expect(onEntityChange).toHaveBeenCalledTimes(1)
          expect(onEntityChange.mock.calls[0][0]).toEqual({
            type: entityTypes.ADDRESS,
            id: 'bc1q2npx7vht0zdj94qh7eeu8l8v75euv39jytcxw7'
          })
        })
      })
    })
  })

  describe('Searching with an valid BTC Transaction', () => {
    describe('Given a <HomeSearch /> component', () => {
      let onEntityChange = null

      beforeEach(() => {
        const info = renderComponent()
        onEntityChange = info.onEntityChange
      })

      describe('when searching with an valid BTC Transaction', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.type(
              screen.getByRole('textbox', { name: 'SEARCH' }),
              '619394a1bb7de1d1f7612dce46357345c892c83905f9f2d8d09a568a29445213'
            )
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Transaction' }))
          )

          await act(() =>
            userEvent.click(screen.getByRole('button', { name: 'Search' }))
          )
        })

        it('should attempt to load the BTC Transaction information', () => {
          expect(onEntityChange).toHaveBeenCalledTimes(1)
          expect(onEntityChange.mock.calls[0][0]).toEqual({
            type: entityTypes.TRANSACTION,
            id: '619394a1bb7de1d1f7612dce46357345c892c83905f9f2d8d09a568a29445213'
          })
        })
      })
    })
  })
})

function renderComponent() {
  const onEntityChange = jest.fn()

  render(
    <AppContext.Provider value={{ onEntityChange }}>
      <HomeSearch />
    </AppContext.Provider>
  )

  return { onEntityChange }
}
