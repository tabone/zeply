import React from 'react'

import PropTypes from 'prop-types'

import { Button, Link } from '@mui/material'

import AppContext from './AppContext'

import entityTypes from './data/entity-types'
import truncateEntityID from './utils/truncate-entity-id'

EntityLink.propTypes = {
  entityID: PropTypes.string,
  type: PropTypes.oneOf(Object.values(entityTypes))
}

function EntityLink(props) {
  const { entityID, type } = props

  const { onEntityChange } = React.useContext(AppContext)

  const onClick = React.useCallback(() => {
    if (
      entityID == null ||
      Object.values(entityTypes).includes(type) === false
    ) {
      return
    }

    onEntityChange({ id: entityID, type })
  }, [entityID, type, onEntityChange])

  const label = React.useMemo(() => truncateEntityID(entityID), [entityID])

  return (
    <Link component={Button} onClick={onClick} title={entityID}>
      {label}
    </Link>
  )
}

export default React.memo(EntityLink)
