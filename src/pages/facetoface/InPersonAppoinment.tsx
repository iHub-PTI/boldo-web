import { Grid, Typography } from '@material-ui/core'
import React from 'react'


import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'


export default function Dashboard() {

  return (
    <>
      <Layout>
        <Grid style={{ padding: '30px' }}>
          <Typography variant='h6' color='textPrimary'>
            Consulta presencial
          </Typography>
        </Grid>
        <Grid container spacing={2}  >
          <Grid item xs={12} md={3}>
            <PatientSection />
          </Grid>

          <Grid style={{ paddingRight:'30px'}} item xs={12} md={9}>
            <MedicalRecordSection  />
          </Grid>

        </Grid>

      </Layout>

    </>
  )
}

