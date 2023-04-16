import { configureStore } from '@reduxjs/toolkit'

import rates from './rates'
import addresses from './addresses'
import transactions from './transactions'
import popularAddresses from './popular-addresses'
import popularTransactions from './popular-transactions'

export default configureStore({
  reducer: {
    rates,
    addresses,
    transactions,
    popularAddresses,
    popularTransactions
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: true,
      serializableCheck: false
    })
  }
})
