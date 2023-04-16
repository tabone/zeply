import React from 'react'

import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

function Field(props) {
  const { label, children } = props

  const fieldID = React.useId()

  return (
    <Box p={1}>
      <Typography variant="caption" id={fieldID}>
        {label}
      </Typography>

      <div aria-labelledby={fieldID}>{children}</div>
    </Box>
  )
}

export default React.memo(Field)
