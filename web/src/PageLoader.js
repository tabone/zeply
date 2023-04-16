import React from 'react'

import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

import loadingImage from './assets/loading.gif'

PageLoader.propTypes = {
  message: PropTypes.string
}

function PageLoader(props) {
  const { message = 'Loading...' } = props

  return (
    <Box
      gap={2}
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      position="absolute"
      justifyContent="center"
      flexDirection="column">
      <Typography>{message}</Typography>

      <img src={loadingImage} alt="Loading..." />

      <Typography variant="h6" component="span">
        Zeply
      </Typography>
    </Box>
  )
}

export default React.memo(PageLoader)
