import React, { useState, useEffect } from 'react'
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
type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient }


export default function Dashboard() {
  const [DynamicMenuSelector, setDynamicMenuSelector] = useState('M')
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  //to manage the view of the ambulatory record
  const [outpatientRecordShow, setOutpatientRecordShow] = useState(false)
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  const { prescriptions, updatePrescriptions } = usePrescriptionContext();

  /*FIXME: Medical Records Section
   When loading the soep, if the ambulatory registry is opened, a visual bug is presented. To fix what I do is block the button while the encounter is loading */
  const [disabledRedcordButton, setDisabledRedcordButton] = useState(true)

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

  useEffect(() => {
    updatePrescriptions(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  return (
    <Layout>
      <div className='flex flex-col h-full overflow-hidden relative'>
        <div className='flex flex-col text-black text-xl p-3 h-13 top-0 left-0'>
          Consulta {appointment && appointment.status !== 'locked' ? 'presencial' : 'finalizada'}
        </div>
        <div className='flex flex-row flex-no-wrap flex-grow'>
          <div className='flex flex-col w-80' style={{ maxWidth: '20rem', minWidth: '20rem' }}>
            {appointment !== null && (
              <PatientSection
                appointment={appointment}
                outpatientRecord={outpatientRecordShow}
                showPatientRecord={() => {
                  setOutpatientRecordShow(!outpatientRecordShow)
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
            className={`flex flex-row h-full w-full left-3/12 bg-white ${outpatientRecordShow && 'absolute inset-0 left-10/12'
              } z-10`}
            style={{ transition: 'left 0.5s linear' }}
          >
            <div className='w-1/12' style={{ width: '5rem' }}>
              <SelectorSection
                setDynamicMenuSelector={(elem: any) => {
                  setDynamicMenuSelector(elem)
                }}
                prescriptions={prescriptions}
                appointment={appointment}
              />
            </div>
            <div className='aboslute h-full w-11/12'>
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
