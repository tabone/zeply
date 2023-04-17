import React from 'react'

import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Grid, Typography, IconButton } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'

import BTC from './BTC'
import Field from './Field'
import Dialog from './Dialog'
import EntitySubscribe from './EntitySubscribe'

import entityTypes from './data/entity-types'
import truncateEntityID from './utils/truncate-entity-id'

import {
  actions as addressesActions,
  operations as addressesOperations
} from './store/addresses'

import { errorTypes } from './Dialog'

AddressDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  entityID: PropTypes.string.isRequired
}

function AddressDialog(props) {
  const { onClose, entityID } = props

  const dispatch = useDispatch()
  const [errorType, setErrorType] = React.useState()
  const [isLoading, setLoading] = React.useState(true)

  const address = useSelector(({ addresses }) => {
    return addresses.get(entityID)
  })

  React.useEffect(() => {
    setLoading(true)

    dispatch(addressesOperations.getByID(entityID))
      .catch((err) => {
        console.error(err)

        if (err.response.status === 400) {
          setErrorType(errorTypes.BAD_REQUEST)
        } else {
          setErrorType(errorTypes.ERROR)
        }
      })
      .then(() => setLoading(false))

    return () => dispatch(addressesActions.remove(entityID))
  }, [dispatch, entityID])

  const labelID = React.useMemo(() => {
    return truncateEntityID(entityID)
  }, [entityID])

  const { spent, balance, unspent, received, transactions } =
    React.useMemo(() => {
      if (address == null) return {}

      return {
        spent: address.get('spent'),
        balance: address.get('balance'),
        unspent: address.get('unspent'),
        received: address.get('received'),
        transactions: address.get('transactions')
      }
    }, [address])

  const titleDOM = React.useMemo(() => {
    return (
      <>
        Address {labelID}{' '}
        <EntitySubscribe entityID={entityID} entityType={entityTypes.ADDRESS} />
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
          <Field label="ID">
            <Typography component="span">{labelID}</Typography>

            <CopyToClipboard text={entityID}>
              <IconButton aria-label="Copy ID" size="small">
                <ContentCopyOutlinedIcon />
              </IconButton>
            </CopyToClipboard>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Confirmed Transactions">
            <Typography>{transactions}</Typography>
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Recieved">
            <BTC value={received} />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Spent">
            <BTC value={spent} />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Unspent">
            <BTC value={unspent} />
          </Field>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Field label="Balance">
            <BTC value={balance} />
          </Field>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default React.memo(AddressDialog)
