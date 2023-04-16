import React from 'react'

import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'

import PopularEntities from './PopularEntities'

import {
  actions as popularAddressesActions,
  operations as popularAddressesOperations
} from './store/popular-addresses'

function PopularAddresses() {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    dispatch(popularAddressesOperations.get())
      .catch((err) => {
        console.error(err)
        enqueueSnackbar(
          'An error occured while retrieving the popular addresses',
          {
            variant: 'error'
          }
        )
      })
      .then(() => {
        setLoading(false)
      })

    return () => {
      dispatch(popularAddressesActions.remove())
    }
  }, [dispatch])

  const addresses = useSelector(({ popularAddresses }) => {
    return popularAddresses
  })

  const records = React.useMemo(() => {
    return addresses
      .reduce((records, address) => {
        if (address.get('hits') != null) {
          records.push({
            id: address.get('id'),
            hits: address.get('hits')
          })
        }

        return records
      }, [])
      .sort((addressOne, addressTwo) => {
        return addressTwo.hits - addressOne.hits
      })
  }, [addresses])

  return (
    <PopularEntities
      records={records}
      loading={isLoading}
      entityType="address"
      title="Popular Addresses"
    />
  )
}

export default React.memo(PopularAddresses)
