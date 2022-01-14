import { Grid, Typography } from '@material-ui/core'
import React  from 'react'


import Layout from '../../components/Layout'
import PatientSection from './PatientSection'

export default function Dashboard() {

  return (
    <>
      <Layout>
      <Grid style={{padding:'30px'}}>
      <Typography variant='h6' color='textPrimary'>
          Consulta Presencial
        </Typography>
      </Grid>
        <Grid container>
          <Grid container>
            <div className="col-md-3">
              <PatientSection />
            </div>

            {/* <div className="p-3 col-md-9">
             //medical data component
            </div> */}
          </Grid>
        </Grid>

      </Layout>

    </>
  )
}

