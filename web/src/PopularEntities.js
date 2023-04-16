import React from 'react'

import PropTypes from 'prop-types'

import {
  Box,
  List,
  ListItem,
  Skeleton,
  Typography,
  ListItemText
} from '@mui/material'

import EntityLink from './EntityLink'
import EntitySubscribe from './EntitySubscribe'

import noDataImage from './assets/no-data.png'

import entityTypes from './data/entity-types'

PopularEntities.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired,
  records: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      hits: PropTypes.number
    })
  )
}

function PopularEntities(props) {
  const { title, entityType, records, loading = false } = props

  const loadingSkeletonDOM = React.useMemo(() => {
    return (
      <Box
        mt={1}
        gap={1}
        display="flex"
        flexDirection="column"
        aria-label="Loading...">
        {Array(5)
          .fill()
          .map((_, index) => {
            return (
              <Skeleton
                key={`skeleton-${index}`}
                variant="rectangular"
                height="41px"
              />
            )
          })}
      </Box>
    )
  }, [])

  const recordsDOM = React.useMemo(() => {
    return records.length === 0 ? (
      <Box
        gap={2}
        height={237}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column">
        <img src={noDataImage} alt="No Data" width="100px" />
        No Data
      </Box>
    ) : (
      records.map((record) => {
        return (
          <ListItem
            key={`popular-entity-${record.id}`}
            secondaryAction={
              <EntitySubscribe entityID={record.id} entityType={entityType} />
            }>
            <ListItemText
              primary={<EntityLink entityID={record.id} type={entityType} />}
            />
          </ListItem>
        )
      })
    )
  }, [records, entityType])

  return (
    <section>
      <header>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </header>

      {loading === true ? loadingSkeletonDOM : <List>{recordsDOM}</List>}
    </section>
  )
}

export default React.memo(PopularEntities)
