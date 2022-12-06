import { Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'

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
  //to manage the view of the ambulatory record
  const [outpatientRecord, setOutpatientRecord] = useState(false)
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  // calculate the width of the selector and patient section
  // const patientSectionRef = useRef<HTMLDivElement>(null)
  // const patientInfoRef = useRef<HTMLDivElement>(null)
  const id = match?.params.id

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await axios.get<AppointmentWithPatient & { token: string }>(`/profile/doctor/appointments/${id}`)
        if (mounted) {
          setAppointment(res.data)
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

  // useEffect(()=>{
  //   if(!patientSectionRef) return
  //   if(!patientInfoRef) return
  //   if(outpatientRecord) {
  //     patientSectionRef.current.style.left =  (patientSectionRef.current.offsetWidth - 400) + 'px'
  //     console.log("wala", patientSectionRef.current.style.left)
  //   }
  //   patientSectionRef.current.style.left = '400px'

  // }, [outpatientRecord])

  return (
    <Layout>
      <Grid className='p-3' style={{ height: '53px' }}>
        <Typography variant='h6' color='textPrimary'>
          Consulta {appointment && appointment.status !== 'locked' ? 'presencial' : 'finalizada'}
        </Typography>
      </Grid>
      <div className='flex flex-row flex-no-wrap overflow-hidden' style={{ height: 'calc(100% - 53px)' }}>
        <div className='h-full w-3/12'>
          {appointment !== null && (
            <PatientSection
              appointment={appointment}
              outpatientRecord={outpatientRecord}
              showPatientRecord={() => {
                setOutpatientRecord(!outpatientRecord)
              }}
            />
          )}
        </div>
        <div
          className={`w-full transform ${outpatientRecord && 'translate-x-10/12'}`}
          style={{
            transition: 'transform 0.3s linear',
          }}
        >
          <div className='flex flex-row h-full w-full'>
            <div className='h-full w-1/12'>
              <SelectorSection
                setDynamicMenuSelector={(elem: any) => {
                  setDynamicMenuSelector(elem)
                }}
              />
            </div>
            <div className='h-full w-11/12'>
              {DynamicMenuSelector === 'P' ? (
                <PrescriptionMenu appointment={appointment} isFromInperson={true} />
              ) : DynamicMenuSelector === 'M' ? (
                <MedicalRecordSection appointment={appointment} />
              ) : (
                <LaboratoryMenu appointment={appointment} isFromInperson={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
