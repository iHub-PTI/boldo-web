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
      <Grid style={{padding:'15px', height:'60px'}}>
        <Typography variant='h6' color='textPrimary'>
          Consulta presencial
        </Typography>
      </Grid>
      <Grid container style={{height:'calc(100% - 60px)'}}>
        <Grid item lg={3} md={3} sm={3} xs={9}>
        <Grid item className='h-full'>
          <PatientSection />
          </Grid>
        </Grid>
        <Grid item lg={1} md={1} sm={1} xs={2}>
          <Grid item className='h-full'>
            <SelectorSection setShowPrescriptionMenu={(elem: any) => {
              setShowPrescriptionMenu(elem)
            }} />
          </Grid>
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={12}>
          {
            showPrescriptionMenu ? <PrescriptionMenu appointment={undefined} isFromInperson={true} /> : <MedicalRecordSection />
          }
        </Grid>
      </Grid>
    </Layout>
  )
}