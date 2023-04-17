import React from 'react'

import PropTypes from 'prop-types'

import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  Dialog as MUIDialog
} from '@mui/material'

import Loading from './Loading'

import fireImage from './assets/fire.png'
import binoImage from './assets/bino.png'

export const errorTypes = {
  ERROR: 'ERROR',
  BAD_REQUEST: 'BAD_REQUEST'
}

Dialog.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  errorType: PropTypes.oneOf(Object.values(errorTypes))
}

function Dialog(props) {
  const { onClose, title, children, loading = false, errorType } = props

  const errorDOM = React.useMemo(() => {
    if (errorType == null) return

    return (
      <Box
        p={2}
        gap={2}
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center">
        {errorType === errorTypes.BAD_REQUEST ? (
          <>
            <img src={binoImage} alt="Bad Request" height="100" />
            <Typography>We couldn't find what you're looking for</Typography>
          </>
        ) : (
          <>
            <img src={fireImage} alt="Error" height="100" />
            <Typography>An error occured, please try again</Typography>
          </>
        )}
      </Box>
    )
  }, [errorType])

  const dialogContentDOM = React.useMemo(() => {
    if (loading === true) return <Loading message="Retrieving Data..." />

    return errorDOM != null ? errorDOM : children
  }, [errorDOM, loading, children])

  const dialogTitleDOM = React.useMemo(() => {
    return errorDOM != null || loading === true ? null : (
      <DialogTitle>
        {title}

        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            top: 8,
            right: 8,
            position: 'absolute',
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
    )
  }, [loading, onClose, title, errorDOM])

  return (
    <MUIDialog open={true} onClose={onClose}>
      {dialogTitleDOM}
      <DialogContent>{dialogContentDOM}</DialogContent>
    </MUIDialog>
  )
}

export default React.memo(Dialog)
