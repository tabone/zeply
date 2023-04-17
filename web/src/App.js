import React from 'react'

import { Set } from 'immutable'

import { useDispatch } from 'react-redux'
import { enqueueSnackbar } from 'notistack'
import CssBaseline from '@mui/material/CssBaseline'
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes
} from '@mui/material/styles'

import Home from './Home'
import AppContext from './AppContext'
import PageLoader from './PageLoader'
import AddressDialog from './AddressDialog'
import BTCWatcher from './utils/BTCWatcher'
import TransactionDialog from './TransactionDialog'

import entityTypes from './data/entity-types'

import {
  actions as ratesActions,
  operations as ratesOperations
} from './store/rates'
import truncateEntityID from './utils/truncate-entity-id'

let theme = createTheme()
theme = responsiveFontSizes(theme)

function App() {
  const dispatch = useDispatch()
  const [watcher, setWatcher] = React.useState()
  const [entity, setEntity] = React.useState(null)
  const [isLoading, setLoading] = React.useState(true)
  const [currency, setCurrency] = React.useState('BTC')

  const [addressesSubscriptions, setAddressesSubscriptions] = React.useState(
    new Set()
  )

  const [transactionsSubscriptions, setTransactionsSubscriptions] =
    React.useState(new Set())

  React.useEffect(() => {
    const watcher = new BTCWatcher()

    watcher.on('message', (message) => {
      enqueueSnackbar(message)
    })

    watcher.on('error', (err, payload) => {
      console.error(err)
      enqueueSnackbar(payload.message, { variant: 'error' })
    })

    watcher.on('open', () => setWatcher(watcher))

    return () => watcher.destroy()
  }, [])

  React.useEffect(() => {
    if (watcher == null) return
    watcher.addresses = [...addressesSubscriptions.values()]
  }, [watcher, addressesSubscriptions])

  React.useEffect(() => {
    if (watcher == null) return
    watcher.transactions = [...transactionsSubscriptions.values()]
  }, [watcher, transactionsSubscriptions])

  React.useEffect(() => {
    ;[
      {
        key: `subscriptions:${entityTypes.ADDRESS}`,
        setter: setAddressesSubscriptions
      },
      {
        key: `subscriptions:${entityTypes.TRANSACTION}`,
        setter: setTransactionsSubscriptions
      }
    ].forEach(({ key, setter }) => {
      const subscriptions = window.localStorage.getItem(key)
      if (subscriptions != null) setter(new Set(subscriptions.split(',')))
    })
  }, [])

  const toggleSubscription = React.useCallback(
    (entityID, entityType) => {
      const subscriptions =
        entityType === entityTypes.ADDRESS
          ? addressesSubscriptions
          : transactionsSubscriptions

      const setter =
        entityType === entityTypes.ADDRESS
          ? setAddressesSubscriptions
          : setTransactionsSubscriptions

      const isPresent = subscriptions.has(entityID) === true

      const newSubscriptions =
        isPresent === true
          ? subscriptions.delete(entityID)
          : subscriptions.add(entityID)

      setter(newSubscriptions)

      window.localStorage.setItem(
        `subscriptions:${entityType}`,
        newSubscriptions.join(',')
      )

      enqueueSnackbar(
        isPresent === true
          ? `You have unsubscribed from ${entityType} ${truncateEntityID(
              entityID
            )}`
          : `You have subscribed to ${entityType} ${truncateEntityID(entityID)}`
      )
    },
    [addressesSubscriptions, transactionsSubscriptions]
  )

  React.useEffect(() => {
    setLoading(true)

    dispatch(ratesOperations.get())
      .catch((err) => {
        console.error(err)
        enqueueSnackbar('An error occured while initializing app', {
          variant: 'error'
        })
      })
      .then(() => setLoading(false))

    return () => dispatch(ratesActions.remove())
  }, [dispatch])

  const onCloseEntityDialog = React.useCallback(() => {
    setEntity(null)
  }, [])

  const entityDialogDOM = React.useMemo(() => {
    if (entity == null) return

    return entity.type === entityTypes.ADDRESS ? (
      <AddressDialog entityID={entity.id} onClose={onCloseEntityDialog} />
    ) : (
      <TransactionDialog entityID={entity.id} onClose={onCloseEntityDialog} />
    )
  }, [entity, onCloseEntityDialog])

  return isLoading === true ? (
    <PageLoader message="We'll be right with you!" />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppContext.Provider
        value={{
          entity,
          currency,
          addressesSubscriptions,
          transactionsSubscriptions,

          onEntityChange: setEntity,
          onCurrencyChange: setCurrency,

          toggleSubscription
        }}>
        <Home />

        {entityDialogDOM}
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default React.memo(App)
