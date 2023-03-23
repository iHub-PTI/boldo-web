import React, { useState, useEffect, useContext } from 'react'
import { usePrescriptionContext } from '../../contexts/Prescriptions/PrescriptionContext';
import Layout from '../../components/Layout'
import PatientSection from './PatientSection'
import MedicalRecordSection from './MedicalRecordSection'
import { PrescriptionMenu } from '../../components/PrescriptionMenu'
import SelectorSection from './SelectorSection'
import { LaboratoryMenu } from '../../components/LaboratoryMenu'
import { useRouteMatch } from 'react-router-dom'
import axios from 'axios'
import { RecordsOutPatient } from '../../components/RecordsOutPatient'
import * as Sentry from '@sentry/react'
import { useToasts } from '../../components/Toast';
import OrganizationBar from '../../components/OrganizationBar';
import { AllOrganizationContext } from '../../contexts/Organizations/organizationsContext'
import { getColorCode } from '../../util/helpers';


type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization }


export default function Dashboard() {
  const [DynamicMenuSelector, setDynamicMenuSelector] = useState('M')
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  //to manage the view of the ambulatory record
  const [outpatientRecordShow, setOutpatientRecordShow] = useState(false)
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  const { prescriptions, updatePrescriptions } = usePrescriptionContext();
  const { Organizations } = useContext(AllOrganizationContext)
  /*FIXME: Medical Records Section
   When loading the soep, if the ambulatory registry is opened, a visual bug is presented. To fix what I do is block the button while the encounter is loading */
  const [disabledRedcordButton, setDisabledRedcordButton] = useState(true)
  const { addToast } = useToasts()


  useEffect(()=>{
    if (DynamicMenuSelector !== 'M') setDisabledRedcordButton(false)
  },[DynamicMenuSelector])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const url = `/profile/doctor/appointments/${id}`
      try {
        const res = await axios.get<AppointmentWithPatient & { token: string }>(url)
        if (mounted) {
          setAppointment(res.data)
        }
      } catch (err) {
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          'appointment_id': id
        })
        if (err.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTag('data', err.response.data)
          Sentry.setTag('headers', err.response.headers)
          Sentry.setTag('status_code', err.response.status)
        } else if (err.request) {
          // The request was made but no response was received
          Sentry.setTag('request', err.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', err.message)
        }
        Sentry.captureMessage("Could not get the appointment")
        Sentry.captureException(err)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudo cargar la cita. ¡Inténtelo de nuevo más tarde!'
        })
      }
    }

    load()

    return () => {
      mounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    updatePrescriptions(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  return (
    <Layout>
      <div className='flex flex-col h-full overflow-hidden relative'>
        <div className='h-6'>{ Organizations && appointment && <OrganizationBar orgColor={getColorCode(Organizations, appointment.organization.id)} orgName={`${appointment.organization.name}`} /> }</div>
        <div className='flex flex-col text-black text-xl p-3 h-13 z-10'>
          Consulta {appointment && appointment.status !== 'locked' ? 'presencial' : 'finalizada'}
        </div>
        <div className='flex flex-row flex-no-wrap flex-1 h-full'>
          <div className='flex flex-col w-80 flex-1 h-full' style={{ maxWidth: '20rem', minWidth: '20rem'}}>
            {appointment !== null && (
              <PatientSection
                appointment={appointment}
                outpatientRecord={outpatientRecordShow}
                showPatientRecord={() => {
                  setOutpatientRecordShow(true)
                }}
                disabledRedcordButton={disabledRedcordButton}
              />
            )}
          </div>
          <div
            className={`flex-col w-0 opacity-0 ${outpatientRecordShow ? 'flex w-7/12 opacity-100' : ''}`}
            style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
          >
            {appointment !== undefined && (
              <RecordsOutPatient
                appointment={appointment}
                show={outpatientRecordShow}
                setShow={setOutpatientRecordShow}
              />
            )}
          </div>
          <div
            className={`flex flex-row h-full w-full left-3/12 bg-white ${outpatientRecordShow && 'inset-0 left-10/12 opacity-25 cursor-default'
              } z-10`}
            style={{ transition: 'left 0.5s linear, opacity 0.5s linear' }}
            onClick={() => outpatientRecordShow && setOutpatientRecordShow(false)}
          >
            <div className='flex flex-col flex-1 h-full w-1/12' style={{ width: '5rem', pointerEvents: outpatientRecordShow ? 'none' : 'auto' }}>
              <SelectorSection
                setDynamicMenuSelector={(elem: any) => {
                  setDynamicMenuSelector(elem)
                }}
                prescriptions={prescriptions}
                appointment={appointment}
              />
            </div>
            <div className='aboslute h-full w-11/12' style={{ pointerEvents: outpatientRecordShow ? 'none' : 'auto' }}>
              {DynamicMenuSelector === 'P' ? (
                <PrescriptionMenu appointment={appointment} isFromInperson={true} />
              ) : DynamicMenuSelector === 'M' ? (
                <MedicalRecordSection appointment={appointment} setDisabledRedcordButton={setDisabledRedcordButton} />
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
