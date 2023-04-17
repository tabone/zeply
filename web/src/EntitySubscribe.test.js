import React from 'react'

import { Set } from 'immutable'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'

import EntitySubscribe from './EntitySubscribe'

import AppContext from './AppContext'
import entityTypes from './data/entity-types'

describe('<EntitySubscribe /> Unit Tests', () => {
  describe('Rendering <EntitySubscribe /> for an entity that user is not subscribed to', () => {
    describe('When rendering an <EntitySubscribe /> for an entity that user is not subscribed to', () => {
      beforeEach(() => {
        renderComponent({
          entityID: 'test-addr-entity-three',
          entityType: entityTypes.ADDRESS
        })
      })

      it('should inform the user that they are not subscribed to it', () => {
        expect(
          screen.getByLabelText(
            'You are not subscribed to BTC address test-addr-entity-three'
          )
        ).toBeInTheDocument()
      })

      it('should allow the user to subscribe to it', () => {
        expect(
          screen.getByRole('button', {
            name: 'Subscribe to BTC address test-addr-entity-three'
          })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Rendering <EntitySubscribe /> for an entity that is subscribed to', () => {
    describe('When rendering an <EntitySubscribe /> for an entity that user is subscribed to', () => {
      beforeEach(() => {
        renderComponent({
          entityID: 'test-addr-entity-two',
          entityType: entityTypes.ADDRESS
        })
      })

      it('should inform the user that they are subscribed to it', () => {
        expect(
          screen.getByLabelText(
            'You are subscribed to BTC address test-addr-entity-two'
          )
        ).toBeInTheDocument()
      })

      it('should allow the user to unsubscribe to it', () => {
        expect(
          screen.getByRole('button', {
            name: 'Unsubscribe from BTC address test-addr-entity-two'
          })
        ).toBeInTheDocument()
      })
    })
  })

  describe('Clicking on <EntitySubscribe /> for an entity that user is not subscribed to', () => {
    describe('Given an <EntitySubscribe /> for an entity that the user is not subscribed to', () => {
      let toggleSubscription = null

      beforeEach(() => {
        toggleSubscription = renderComponent({
          entityID: 'test-addr-entity-three',
          entityType: entityTypes.ADDRESS
        }).toggleSubscription
      })

      describe('when clicking to subscribe', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(
              screen.getByRole('button', {
                name: 'Subscribe to BTC address test-addr-entity-three'
              })
            )
          )
        })

        it('should attempt to subscribe the entity', () => {
          expect(toggleSubscription).toHaveBeenCalledTimes(1)

          expect(toggleSubscription).toHaveBeenCalledWith(
            'test-addr-entity-three',
            entityTypes.ADDRESS
          )
        })
      })
    })
  })

  describe('Clicking on <EntitySubscribe /> for an entity that is subscribed to', () => {
    describe('Given an <EntitySubscribe /> for an entity that the user is subscribed to', () => {
      let toggleSubscription = null

      beforeEach(() => {
        toggleSubscription = renderComponent({
          entityID: 'test-addr-entity-two',
          entityType: entityTypes.ADDRESS
        }).toggleSubscription
      })

      describe('when clicking to unsubscribe', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(
              screen.getByRole('button', {
                name: 'Unsubscribe from BTC address test-addr-entity-two'
              })
            )
          )
        })

        it('should attempt to unsubscribe the entity', () => {
          expect(toggleSubscription).toHaveBeenCalledTimes(1)

          expect(toggleSubscription).toHaveBeenCalledWith(
            'test-addr-entity-two',
            entityTypes.ADDRESS
          )
        })
      })
    })
  })
})

function renderComponent(info = {}) {
  const {
    entityID,
    entityType,
    addressesSubscriptions = new Set([
      'test-addr-entity-one',
      'test-addr-entity-two'
    ]),
    transactionsSubscriptions = new Set([
      'test-trx-entity-one',
      'test-trx-entity-two'
    ])
  } = info

  const toggleSubscription = jest.fn()

  render(
    <AppContext.Provider
      value={{
        toggleSubscription,
        addressesSubscriptions,
        transactionsSubscriptions
      }}>
      <EntitySubscribe entityID={entityID} entityType={entityType} />
    </AppContext.Provider>
  )

  return {
    toggleSubscription
  }
}
