import React from 'react'

import { render, screen } from '@testing-library/react'

import Date from './Date'
import Field from './Field'

describe('<Date /> Unit Tests', () => {
  describe('Rendering a <Date />', () => {
    describe('When rendering a <Date />', () => {
      let date = null

      beforeEach(() => {
        date = new window.Date(2022, 1, 4)
        renderComponent(date.getTime())
      })

      it('should <Date /> with a value', () => {
        expect(screen.getByLabelText('test-date')).toHaveTextContent(
          '04/02/2022'
        )
      })
    })
  })

  describe('Rendering a <Date /> without a value', () => {
    describe('When rendering a <Date /> without a value', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should <Date /> with a value', () => {
        expect(screen.getByLabelText('test-date')).toHaveTextContent('')
      })
    })
  })
})

function renderComponent(value) {
  return render(
    <Field label="test-date">
      <Date value={value} />
    </Field>
  )
}
