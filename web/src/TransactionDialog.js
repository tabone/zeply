import React from 'react'

import PropTypes from 'prop-types'

import { Grid, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import BTC from './BTC'
import Date from './Date'
import Field from './Field'
import Dialog from './Dialog'
import EntitySubscribe from './EntitySubscribe'

import entityTypes from './data/entity-types'
import truncateEntityID from './utils/truncate-entity-id'

import {
  actions as transactionsActions,
  operations as transactionsOperations
} from './store/transactions'

import { errorTypes } from './Dialog'

TransactionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  entityID: PropTypes.string.isRequired
}

function TransactionDialog(props) {
  const { onClose, entityID } = props

  const dispatch = useDispatch()
  const [errorType, setErrorType] = React.useState()
  const [isLoading, setLoading] = React.useState(true)

  const transaction = useSelector(({ transactions }) => {
    return transactions.get(entityID)
  })

  React.useEffect(() => {
    setLoading(true)

    dispatch(transactionsOperations.getByID(entityID))
      .catch((err) => {
        console.error(err)

        if (err.response.status === 400) {
          setErrorType(errorTypes.BAD_REQUEST)
        } else {
          setErrorType(errorTypes.ERROR)
        }
      })
      .then(() => setLoading(false))

    return () => {
      dispatch(transactionsActions.remove(entityID))
    }
  }, [dispatch, entityID])

  const labelID = React.useMemo(() => {
    return truncateEntityID(entityID)
  }, [entityID])

  const {
    size,
    fees,
    confirmed,
    btc_input,
    btc_output,
    confirmations,
    received_time
  } = React.useMemo(() => {
    if (transaction == null) return {}

    return {
      size: transaction.get('size'),
      fees: transaction.get('fees'),
      confirmed: transaction.get('confirmed'),
      btc_input: transaction.get('btc_input'),
      btc_output: transaction.get('btc_output'),
      confirmations: transaction.get('confirmations'),
      received_time: transaction.get('received_time')
    }
  }, [transaction])

  const titleDOM = React.useMemo(() => {
    return (
      <>
        Transaction {labelID}{' '}
        <EntitySubscribe
          entityID={entityID}
          entityType={entityTypes.TRANSACTION}
        />
      </>
    )
  }, [labelID, entityID])

  return (
    <Dialog
      title={titleDOM}
      onClose={onClose}
      loading={isLoading}
      errorType={errorType}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Field label="Status">
            <Typography color={confirmed === true ? 'primary' : 'default'}>
              {confirmed === true ? 'CONFIRMED' : 'UNCONFIRMED'}
            </Typography>
          </Field>
        </Grid>

        {confirmed === true && (
          <>
            <Grid item xs={12} sm={6}>
              <Field label="Received Time">
                <Date value={received_time} />
              </Field>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Field label="Confirmations">
                <Typography>{confirmations}</Typography>
              </Field>
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <Field label="Size">
            <Typography>{size}Bytes</Typography>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="BTC Input">
            <BTC value={btc_input} />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="BTC Output">
            <BTC value={btc_output} />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Fees">
            <BTC value={fees} />
          </Field>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default React.memo(TransactionDialog)
