import React from 'react'

import { Box, Container, Grid } from '@mui/material'

import Topbar from './Topbar'
import HomeSearch from './HomeSearch'
import PopularAddresses from './PopularAddresses'
import PopularTransactions from './PopularTransactions'

function Home() {
  return (
    <div>
      <Topbar />

      <Box gap={4} display="flex" flexDirection="column">
        <HomeSearch />

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <PopularTransactions />
            </Grid>

            <Grid item xs={12} md={6}>
              <PopularAddresses />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}

export default React.memo(Home)
