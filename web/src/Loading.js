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
      alignItems="center"
      flexDirection="column"
      justifyContent="center">
      <img src={loadingImage} alt="Loading..." />
      <Typography>{message}</Typography>
    </Box>
  )
}

export default React.memo(Loading)
