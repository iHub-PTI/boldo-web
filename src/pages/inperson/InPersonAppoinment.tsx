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
import { RecordsOutPatient } from '../../components/RecordsOutPatient'
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

export default function Dashboard() {
  const [DynamicMenuSelector, setDynamicMenuSelector] = useState('M')
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  //to manage the view of the ambulatory record
  const [outpatientRecordShow, setOutpatientRecordShow] = useState(false)
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
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

  return (
    <Layout>
      <div className='flex flex-col h-full'>
        <div className='flex flex-col text-black text-xl p-3 h-13 top-0 left-0'>
          Consulta {appointment && appointment.status !== 'locked' ? 'presencial' : 'finalizada'}
        </div>
        <div className='flex flex-row flex-no-wrap flex-grow'>
          <div className='flex flex-col w-3/12 min-w-max-content h-screen sticky top-0 left-0'>
            {appointment !== null && (
              <PatientSection
                appointment={appointment}
                outpatientRecord={outpatientRecordShow}
                showPatientRecord={() => {
                  setOutpatientRecordShow(!outpatientRecordShow)
                }}
              />
            )}
          </div>
          <div className='flex flex-col w-full h-full overflow-auto'>
            <RecordsOutPatient show={outpatientRecordShow} setShow={setOutpatientRecordShow} consultations={[]} />
          </div>
          {/* <div className='flex flex-row h-full w-full'>
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
        </div> */}
        </div>
      </div>
    </Layout>
  )
}
