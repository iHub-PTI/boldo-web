import { Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'

import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'
import { PrescriptionMenu } from '../../components/PrescriptionMenu'
import SelectorSection from './SelectorSection'

export default function Dashboard() {
  const [showPrescriptionMenu, setShowPrescriptionMenu] = useState(false)
  return (
    <Layout>
      <Grid style={{padding:'23px'}}>
        <Typography variant='h6' color='textPrimary'>
          Consulta presencial
        </Typography>
      </Grid>
      <Grid container>
        <Grid item xs={3} md={3} >
          <PatientSection />
        </Grid>
        <Grid item>
          <SelectorSection setShowPrescriptionMenu={(elem: any) => {
            setShowPrescriptionMenu(elem)
          }} />
        </Grid>
        <Grid item xs={8} md={8} >
          {
            showPrescriptionMenu ? <PrescriptionMenu appointment={undefined} isFromInperson={true} /> : <MedicalRecordSection />
          }
        </Grid>
      </Grid>
    </Layout>
  )
}