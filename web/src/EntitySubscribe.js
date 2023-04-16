import React from 'react'

import { Set } from 'immutable'

import PropTypes from 'prop-types'

import { IconButton } from '@mui/material'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'

import AppContext from './AppContext'
import entityTypes from './data/entity-types'

EntitySubscribe.propTypes = {
  entityID: PropTypes.string,
  entityType: PropTypes.oneOf(Object.values(entityTypes))
}

function EntitySubscribe(props) {
  const { entityID, entityType } = props

  const {
    toggleSubscription,
    addressesSubscriptions,
    transactionsSubscriptions
  } = React.useContext(AppContext)

  const isRenderable = React.useMemo(() => {
    return (
      entityID != null &&
      Object.values(entityTypes).includes(entityType) === true
    )
  }, [entityID, entityType])

  const subscriptions = React.useMemo(() => {
    if (isRenderable === false) return new Set()

    return entityType === entityTypes.ADDRESS
      ? addressesSubscriptions
      : transactionsSubscriptions
  }, [
    entityType,
    isRenderable,
    addressesSubscriptions,
    transactionsSubscriptions
  ])

  const isSubscribed = React.useMemo(() => {
    return subscriptions.has(entityID)
  }, [entityID, subscriptions])

  const label = React.useMemo(() => {
    if (isRenderable === false) return

    const type = entityType.toLowerCase()

    return isSubscribed === true
      ? `You are subscribed to BTC ${type} ${entityID}`
      : `You are not subscribed to BTC ${type} ${entityID}`
  }, [isSubscribed, entityID, entityType, isRenderable])

  const subscribeLabel = React.useMemo(() => {
    if (isRenderable === false) return

    const type = entityType.toLowerCase()

    return isSubscribed === true
      ? `Unsubscribe from BTC ${type} ${entityID}`
      : `Subscribe to BTC ${type} ${entityID}`
  }, [isSubscribed, entityID, entityType, isRenderable])

  return isRenderable === false ? null : (
    <IconButton
      edge="end"
      onClick={() => toggleSubscription(entityID, entityType)}
      aria-label={subscribeLabel}>
      {isSubscribed === true ? (
        <BookmarkOutlinedIcon aria-label={label} />
      ) : (
        <BookmarkBorderOutlinedIcon aria-label={label} />
      )}
    </IconButton>
  )
}

export default React.memo(EntitySubscribe)
