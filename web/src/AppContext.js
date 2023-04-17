import React from 'react'

import { Set } from 'immutable'

export default React.createContext({
  entity: null,
  currency: 'BTC',

  addressesSubscriptions: new Set(),
  transactionsSubscriptions: new Set(),

  onEntityChange: () => {},
  onCurrencyChange: () => {},
  toggleSubscription: () => {}
})
