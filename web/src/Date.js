import React from 'react'

import PropTypes from 'prop-types'

import { Typography } from '@mui/material'

Date.propTypes = {
  value: PropTypes.number
}

function Date(props) {
  const { value, ...otherProps } = props

  const label = React.useMemo(() => {
    if (value == null) return

    const date = new window.Date(value)

    const day = String(date.getDate()).padStart(2, 0)
    const month = String(date.getMonth() + 1).padStart(2, 0)
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }, [value])

  return <Typography {...otherProps}>{label}</Typography>
}

export default React.memo(Date)
