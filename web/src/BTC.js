import React from 'react'

import PropTypes from 'prop-types'

import { useSelector } from 'react-redux'

import AppContext from './AppContext'

BTC.propTypes = {
  value: PropTypes.number
}

function BTC(props) {
  const { value = 0 } = props

  const { currency } = React.useContext(AppContext)

  const { rates } = useSelector(({ rates }) => {
    return { rates }
  })

  const { dp, symbol, rate } = React.useMemo(() => {
    return {
      dp: rates.getIn([currency, 'dp']),
      rate: rates.getIn([currency, 'rate']),
      symbol: rates.getIn([currency, 'symbol'])
    }
  }, [rates, currency])

  return React.useMemo(() => {
    const amount = (value * rate).toFixed(dp)
    return `${symbol}${amount}`
  }, [dp, value, rate, symbol])
}

export default React.memo(BTC)
