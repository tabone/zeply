import React from 'react'

import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

import loadingImage from './assets/loading.gif'

Loading.propTypes = {
  message: PropTypes.string
}

function Loading(props) {
  const { message = 'Loading...' } = props

  return (
    <Box
      p={2}
      gap={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center">
      <img src={loadingImage} alt="Loading..." />
      <Typography>{message}</Typography>
    </Box>
  )
}

export default React.memo(Loading)
