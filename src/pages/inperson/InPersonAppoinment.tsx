import { Grid, Typography } from '@material-ui/core'
import React from 'react'


import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'
import { PrescriptionMenu } from '../../components/PrescriptionMenu'
import SelectorSection from './SelectorSection'



export default function Dashboard() {

  return (
    
      <Layout>
        <Grid style={{ padding: '30px' }}>
          <Typography variant='h6' color='textPrimary'>
            Consulta presencial
          </Typography>
        </Grid>
        <Grid container  >
          <Grid item xs={8} md={3} >
            <PatientSection />
          </Grid>
          <Grid item  >
            <SelectorSection />
          </Grid>
          <Grid item xs={12} md={8} >
            {/* <MedicalRecordSection  /> */}
            <PrescriptionMenu appointment={undefined} isFromInperson={true} />
          </Grid>

        </Grid>

      </Layout>

    
  )
}

