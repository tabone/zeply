import React from 'react'

import { render, screen } from '@testing-library/react'

import Loading from './Loading'

describe('<Loading /> Unit Tests', () => {
  describe('Rendering the <Loading /> component without specifying a message', () => {
    describe('When rendering the <Loading /> component without specifying a message', () => {
      beforeEach(() => {
        render(<Loading />)
      })

      it('should render the <Loading /> component with the default message', () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })
  })

  describe('Rendering the <Loading /> component with a message', () => {
    describe('When rendering the <Loading /> component with a message', () => {
      let message = null

      beforeEach(() => {
        message = 'test-message'

        render(<Loading message={message} />)
      })

      it('should render the <Loading /> component with the specified message', () => {
        expect(screen.getByText(message)).toBeInTheDocument()
      })
    })
  })
})
