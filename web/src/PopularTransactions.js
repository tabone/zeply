import React from 'react'

import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'

import PopularEntities from './PopularEntities'

import {
  actions as popularTransactionsActions,
  operations as popularTransactionsOperations
} from './store/popular-transactions'

function PopularTransactions() {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    dispatch(popularTransactionsOperations.get())
      .catch((err) => {
        console.error(err)
        enqueueSnackbar(
          'An error occured while retrieving the popular transactions',
          {
            variant: 'error'
          }
        )
      })
      .then(() => {
        setLoading(false)
      })

    return () => {
      dispatch(popularTransactionsActions.remove())
    }
  }, [dispatch])

  const transactions = useSelector(({ popularTransactions }) => {
    return popularTransactions
  })

  const records = React.useMemo(() => {
    return transactions
      .reduce((records, transaction) => {
        if (transaction.get('hits') != null) {
          records.push({
            id: transaction.get('id'),
            hits: transaction.get('hits')
          })
        }

        return records
      }, [])
      .sort((transactionOne, transactionTwo) => {
        return transactionTwo.hits - transactionOne.hits
      })
  }, [transactions])

  return (
    <PopularEntities
      records={records}
      loading={isLoading}
      entityType="transaction"
      title="Popular Transactions"
    />
  )
}

export default React.memo(PopularTransactions)
