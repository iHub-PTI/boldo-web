import { Grid, Typography } from '@material-ui/core'
import React  from 'react'


import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'
import SelectorSection from './SelectorSection'

export default function Dashboard() {

  return (
    <>
      <Layout>
      <Grid style={{padding:'30px'}}>
      <Typography variant='h6' color='textPrimary'>
          Consulta presencial
        </Typography>
      </Grid>
        <Grid container>
          <Grid container>
            <div className="col-md-3">
              <PatientSection />
            </div>
            <div className="col-md-2">
              <SelectorSection />
            </div>

            <div className="p-3 col-md-7">
             <MedicalRecordSection />
            </div>
          </Grid>
        </Grid>

      </Layout>

    </>
  )
}

