import React from 'react'

import { render, screen } from '@testing-library/react'

import Field from './Field'

describe('<Field /> Unit Tests', () => {
  describe('Rendering a <Field /> with a value', () => {
    describe('When rendering a <Field> with a value', () => {
      beforeEach(() => {
        render(<Field label="test-label">test-value</Field>)
      })

      it('should render label-value pair', () => {
        expect(screen.getByLabelText('test-label')).toHaveTextContent(
          'test-value'
        )
      })
    })
  })
})
