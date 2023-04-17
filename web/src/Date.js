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

    const year = date.getFullYear()

    const [day, month] = [date.getDate(), date.getMonth() + 1].map(
      (section) => {
        return String(section).padStart(2, 0)
      }
    )

    return `${day}/${month}/${year}`
  }, [value])

  return <Typography {...otherProps}>{label}</Typography>
}

export default React.memo(Date)
