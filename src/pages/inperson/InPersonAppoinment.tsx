import { Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'

import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'
import { PrescriptionMenu } from '../../components/PrescriptionMenu'
import SelectorSection from './SelectorSection'
import { LaboratoryMenu } from '../../components/LaboratoryMenu'
import { useRouteMatch } from 'react-router-dom'
import axios from 'axios'
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

export default function Dashboard() {
  const [DynamicMenuSelector, setDynamicMenuSelector] = useState('M')
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await axios.get<AppointmentWithPatient & { token: string }>(`/profile/doctor/appointments/${id}`)
        if (mounted) {
          setAppointment(res.data);
        }
      } catch (err) {
        console.log(err)
        // if (mounted) {
        //   addErrorToast('¡Fallo en la carga de la cita!')
        //   history.replace(`/`)
        // }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [id])
  return (
    <Layout>
      <Grid className='p-3' style={{height: '53px'}}>
        <Typography variant='h6' color='textPrimary'>
          Consulta {appointment && appointment.status !== 'locked' ? 'presencial':'finalizada'}
        </Typography>
      </Grid>
      <Grid 
       style={{height: 'calc(100% - 53px)'}}
       container>
        <Grid item lg={3} md={3} sm={3} xs={9}>
        {appointment !== null &&
          <PatientSection appointment = {appointment}/>}
        </Grid>
        <Grid item lg={1} md={1} sm={1} xs={2}>
          <Grid item className='h-full'>
            <SelectorSection setDynamicMenuSelector={(elem: any) => {
              setDynamicMenuSelector(elem)
            }} />
          </Grid>
        </Grid>
        <Grid item lg={8} md={8} sm={8} xs={12}>
          {
            DynamicMenuSelector === 'P' ? <PrescriptionMenu appointment={undefined} isFromInperson={true} /> : DynamicMenuSelector === 'M' ? <MedicalRecordSection /> : <LaboratoryMenu appointment={appointment} isFromInperson={true} />
          }
        </Grid>
      </Grid>
    </Layout>
  )
}