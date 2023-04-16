import React from 'react'

import { render, screen } from '@testing-library/react'

import PageLoader from './PageLoader'

describe('<PageLoader /> Unit Tests', () => {
  describe('Rendering the <PageLoader /> component without specifying a message', () => {
    describe('When rendering the <PageLoader /> component without specifying a message', () => {
      beforeEach(() => {
        render(<PageLoader />)
      })

      it('should render the <PageLoader /> component with the default message', () => {
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })
    })
  })

  describe('Rendering the <PageLoader /> component with a message', () => {
    describe('When rendering the <PageLoader /> component with a message', () => {
      let message = null

      beforeEach(() => {
        message = 'test-message'

        render(<PageLoader message={message} />)
      })

      it('should render the <PageLoader /> component with the specified message', () => {
        expect(screen.getByText(message)).toBeInTheDocument()
      })
    })
  })
})
