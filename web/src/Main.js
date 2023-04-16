import React from 'react'

import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

import App from './App'
import store from './store'

function Main() {
  return (
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={3000}>
        <App />
      </SnackbarProvider>
    </Provider>
  )
}

export default React.memo(Main)
