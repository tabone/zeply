import React from 'react'

import { useSelector } from 'react-redux'
import { Box, Button, Menu, MenuItem, Paper, Typography } from '@mui/material'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined'

import AppContext from './AppContext'

function Topbar() {
  const { currency = 'BTC', onCurrencyChange } = React.useContext(AppContext)

  const currencyButtonRef = React.useRef()
  const [isCurrencyMenuVisible, setCurrencyMenuVisibility] =
    React.useState(false)

  const currencyMenuID = React.useId()
  const currencyButtonID = React.useId()

  const rates = useSelector(({ rates }) => rates)

  const onCurrencyButtonClick = React.useCallback(() => {
    setCurrencyMenuVisibility(true)
  }, [])

  const onCurrencyMenuClose = React.useCallback(() => {
    setCurrencyMenuVisibility(false)
  }, [])

  const onCurrencySelection = React.useCallback(
    (currency) => {
      onCurrencyMenuClose()
      onCurrencyChange(currency)
    },
    [onCurrencyChange, onCurrencyMenuClose]
  )

  const currenciesDOM = React.useMemo(() => {
    return [...rates.values()].map((rate) => {
      const currency = rate.get('id')

      return (
        <MenuItem key={currency} onClick={() => onCurrencySelection(currency)}>
          {currency}
        </MenuItem>
      )
    })
  }, [rates, onCurrencySelection])

  return (
    <Box
      pt={1}
      pb={1}
      pl={2}
      pr={2}
      top={0}
      zIndex={1000}
      square={true}
      display="flex"
      position="sticky"
      component={Paper}
      alignItems="center"
      justifyContent="space-between">
      <Typography variant="h6" component="h1">
        Zeply
      </Typography>

      <div>
        <Button
          aria-haspopup="true"
          id={currencyButtonID}
          ref={currencyButtonRef}
          aria-label="Current Currency"
          onClick={onCurrencyButtonClick}
          startIcon={<CurrencyExchangeOutlinedIcon />}
          aria-expanded={isCurrencyMenuVisible ? 'true' : undefined}
          aria-controls={isCurrencyMenuVisible ? currencyMenuID : undefined}>
          {currency}
        </Button>

        <Menu
          id={currencyMenuID}
          open={isCurrencyMenuVisible}
          onClose={onCurrencyMenuClose}
          anchorEl={currencyButtonRef.current}
          MenuListProps={{ 'aria-labelledby': currencyButtonID }}>
          {currenciesDOM}
        </Menu>
      </div>
    </Box>
  )
}

export default React.memo(Topbar)
