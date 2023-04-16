import React from 'react'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import AppContext from './AppContext'
import homeBG from './assets/home-bg.png'

import entityTypes from './data/entity-types'

const TRANSACTION_ID_PATTERN = /^[a-fA-F0-9]{64}$/
const ADDRESS_ID_PATTERN = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/

function HomeSearch() {
  const { onEntityChange } = React.useContext(AppContext)

  const theme = useTheme()
  const [type, setType] = React.useState()
  const [search, setSearch] = React.useState('')
  const isSmallViewport = useMediaQuery(theme.breakpoints.down('sm'))
  const [searchErrorMessage, setSearchErrorMessage] = React.useState()

  const searchID = React.useId()

  const searchPlaceholder = React.useMemo(() => {
    switch (type) {
      case entityTypes.ADDRESS:
        return 'Search BTC Address...'
      case entityTypes.TRANSACTION:
        return 'Search BTC Transaction...'
      default:
        return 'Search...'
    }
  }, [type])

  const onSearchChange = React.useCallback((ev) => {
    setSearch(ev.target.value)
  }, [])

  const onTypeChange = React.useCallback((_, type) => {
    setType(type)
  }, [])

  const isSubmittable = React.useMemo(() => {
    return search !== '' && type != null
  }, [search, type])

  const onSubmit = React.useCallback(() => {
    if (
      type === entityTypes.ADDRESS &&
      ADDRESS_ID_PATTERN.test(search) === false
    ) {
      setSearchErrorMessage(
        "Sorry, we couldn't recognize the BTC address you entered. Please verify that it is correct and try again."
      )
      return
    }

    if (
      type === entityTypes.TRANSACTION &&
      TRANSACTION_ID_PATTERN.test(search) === false
    ) {
      setSearchErrorMessage(
        "Sorry, we couldn't recognize the BTC transaction you entered. Please verify that it is correct and try again."
      )
      return
    }

    setSearchErrorMessage(null)
    onEntityChange({ type, id: search })
  }, [type, search, onEntityChange])

  return (
    <Box
      p={2}
      gap={2}
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      height={isSmallViewport === true ? 350 : 500}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${homeBG})`
      }}>
      <Typography
        variant="h4"
        id={searchID}
        component="h1"
        sx={{ color: '#ffffff' }}>
        SEARCH
      </Typography>

      <Paper
        p={2}
        gap={2}
        width="100%"
        maxWidth={500}
        display="flex"
        component={Box}
        alignItems="center"
        flexDirection="column">
        <TextField
          fullWidth
          inputProps={{
            'aria-labelledby': searchID
          }}
          value={search}
          variant="outlined"
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          error={searchErrorMessage != null}
          size={isSmallViewport === true ? 'small' : 'medium'}
        />

        <Typography
          variant="caption"
          align="center"
          sx={{ color: (theme) => theme.palette.grey[500] }}>
          {searchErrorMessage}
        </Typography>

        <ToggleButtonGroup
          fullWidth
          exclusive
          size="small"
          value={type}
          onChange={onTypeChange}>
          <ToggleButton value={entityTypes.ADDRESS}>Address</ToggleButton>
          <ToggleButton value={entityTypes.TRANSACTION}>
            Transaction
          </ToggleButton>
        </ToggleButtonGroup>

        <Button
          fullWidth
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmittable === false}
          size={isSmallViewport === true ? 'medium' : 'large'}>
          Search
        </Button>
      </Paper>
    </Box>
  )
}

export default React.memo(HomeSearch)
