import React from 'react'

import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'

import Field from './Field'
import EntityLink from './EntityLink'

import AppContext from './AppContext'
import entityTypes from './data/entity-types'

describe('<EntityLink /> Unit Tests', () => {
  describe('Rendering an <EntityLink />', () => {
    describe('When rendering an <EntityLink />', () => {
      let entityID = null

      beforeEach(() => {
        entityID =
          '737d8a96288d4e8905f076430c6387c8551b9707a53cbb3f2f8099fdcb1cb894'

        renderComponent({ entityID, entityType: entityTypes.ADDRESS })
      })

      it('should show render the ID of the Entity', () => {
        expect(
          screen.getByRole('button', { name: '737d8a96 ... cb1cb894' })
        ).toHaveTextContent('737d8a96 ... cb1cb894')
      })
    })
  })

  describe('Rendering an <EntityLink /> without specifying an Entity ID and Entity Type', () => {
    describe('When rendering an <EntityLink /> without specifying an Entity ID and Entity Type', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should not render anything', () => {
        expect(screen.getByLabelText('test-entity-link')).toHaveTextContent('')
      })
    })
  })

  describe('Clicking on an <EntityLink />', () => {
    describe('Given an <EntityLink />', () => {
      let type = null
      let entityID = null
      let onEntityChange = null

      beforeEach(() => {
        type = entityTypes.ADDRESS
        entityID =
          '737d8a96288d4e8905f076430c6387c8551b9707a53cbb3f2f8099fdcb1cb894'

        const info = renderComponent({ entityID, type })
        onEntityChange = info.onEntityChange
      })

      describe('when clicking on the <EntityLink />', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(
              screen.getByRole('button', { name: '737d8a96 ... cb1cb894' })
            )
          )
        })

        it('should display the details of the selected entity', () => {
          expect(onEntityChange).toHaveBeenCalledTimes(1)
          expect(onEntityChange.mock.calls[0][0]).toEqual({
            type,
            id: entityID
          })
        })
      })
    })
  })

  describe('Clicking on an <EntityLink /> that does not have all the info about the Entity', () => {
    describe('Given an <EntityLink /> that does not have all the info about the Entity', () => {
      let entityID = null
      let onEntityChange = null

      beforeEach(() => {
        entityID =
          '737d8a96288d4e8905f076430c6387c8551b9707a53cbb3f2f8099fdcb1cb894'
        const info = renderComponent({ entityID })
        onEntityChange = info.onEntityChange
      })

      describe('when clicking on the <EntityLink />', () => {
        beforeEach(async () => {
          await act(() =>
            userEvent.click(
              screen.getByRole('button', { name: '737d8a96 ... cb1cb894' })
            )
          )
        })

        it('should do nothing', () => {
          expect(onEntityChange).toHaveBeenCalledTimes(0)
        })
      })
    })
  })
})

function renderComponent(info = {}) {
  const { entityID, type } = info

  const onEntityChange = jest.fn()

  render(
    <AppContext.Provider value={{ onEntityChange }}>
      <Field label="test-entity-link">
        <EntityLink entityID={entityID} type={type} />
      </Field>
    </AppContext.Provider>
  )

  return {
    onEntityChange
  }
}
