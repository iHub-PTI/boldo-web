import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { LaboratoryMenu } from '../../components/LaboratoryMenu';
import Layout from '../../components/Layout';
import MedicalHistory from '../../components/MedicalHistory';
import OrganizationBar from '../../components/OrganizationBar';
import { PrescriptionMenu } from '../../components/PrescriptionMenu';
import { RecordsOutPatient } from '../../components/RecordsOutPatient';
import { useToasts } from '../../components/Toast';
import OrderHistory from '../../components/history-study-order/OrderHistory';
import StudyHistory from '../../components/history-study-order/StudyHistory';
import UploadStudies from '../../components/upload-studies/UploadStudies';
import { AllOrganizationContext } from '../../contexts/Organizations/organizationsContext';
import { usePrescriptionContext } from '../../contexts/Prescriptions/PrescriptionContext';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { HEIGHT_BAR_STATE_APPOINTMENT, ORGANIZATION_BAR } from '../../util/constants';
import { getColorCode } from '../../util/helpers';
import MedicalRecordSection from './MedicalRecordSection';
import PatientSection from './PatientSection';
import SelectorSection from './SelectorSection';
import { MenuStudyOrder } from '../../components/MenuStudyOrder';


type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization }


export default function Dashboard() {
  const [DynamicMenuSelector, setDynamicMenuSelector] = useState('M')
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  const { addToast } = useToasts()
  const { prescriptions, updatePrescriptions } = usePrescriptionContext();

  //to manage the view of the ambulatory record
  const [outpatientRecordShow, setOutpatientRecordShow] = useState(false)

  //to manage the view of the medical history
  const [showMedicalHistory, setShowMedicalHistory] = useState(false)

  //to manage the view of the studies history
  const [showStudiesHistory, setShowStudiesHistory] = useState(false)

  //to manage the view of the order history
  const [showOrderHistory, setShowOrderHistory] = useState(false)

  const { Organizations } = useContext(AllOrganizationContext)

  /*FIXME: Medical Records Section
   When loading the soep, if the ambulatory registry is opened, a visual bug is presented. To fix what I do is block the button while the encounter is loading */
  const [disabledRedcordButton, setDisabledRedcordButton] = useState(true)

  const menuSelected = {
    'P': <PrescriptionMenu appointment={appointment} isFromInperson={true} />,
    'M': <MedicalRecordSection appointment={appointment} setDisabledRedcordButton={setDisabledRedcordButton} />,
    'L': <MenuStudyOrder appointment={appointment} isFromInperson={true} />,
    'U': <UploadStudies patientId={`${appointment?.patientId ?? ''}`} />
  }

  useEffect(() => {
    if (DynamicMenuSelector !== 'M') setDisabledRedcordButton(false)
  }, [DynamicMenuSelector])

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
        const tags = {
          'endpoint': url,
          'method': 'GET',
          'appointment_id': id
        }
        handleSendSentry(err, ERROR_HEADERS.APPOINTMENT.FAILURE_GET, tags)
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
        <div className='h-6'>{Organizations && appointment && <OrganizationBar orgColor={getColorCode(Organizations, appointment.organization.id)} orgName={`${appointment.organization.name}`} />}</div>
        <div className='flex flex-col text-black text-xl p-3 h-13 z-10'>
          Consulta
          {
            appointment?.appointmentType === 'A' && appointment?.status !== 'locked' ?
              ' presencial' :
              appointment?.appointmentType === 'A' && appointment?.status === 'locked' ?
                ' presencial finalizada' :
                appointment?.appointmentType === 'V' && appointment?.status === 'locked' ?
                  ' virtual finalizada' :
                  ' ...'
          }
        </div>
        <div className='flex flex-row flex-no-wrap flex-1 h-full'>
          <div className='flex flex-col w-80 flex-1 h-full' style={{ maxWidth: '20rem', minWidth: '20rem' }}>
            {appointment !== null && (
              <PatientSection
                appointment={appointment}
                disabledRedcordButton={disabledRedcordButton}
                outpatientRecordShow={outpatientRecordShow}
                setOutpatientRecordShow={setOutpatientRecordShow}
                showMedicalHistory={showMedicalHistory}
                setShowMedicalHistory={setShowMedicalHistory}
                showStudiesHistory={showStudiesHistory}
                setShowStudiesHistory={setShowStudiesHistory}
                showOrderHistory={showOrderHistory}
                setShowOrderHistory={setShowOrderHistory}
              />
            )}
          </div>
          <div
            className=
            {`flex-col w-0 opacity-0
              ${outpatientRecordShow || showStudiesHistory || showOrderHistory ?
                'flex w-7/12 opacity-100 overflow-x-auto' :
                showMedicalHistory ?
                  'flex w-3/12 opacity-100' :
                  ''
              }
            `}
            style={{
              transition: 'width 0.5s linear, opacity 0.5s linear',
            }}
          >
            {appointment && (
              <>
                <RecordsOutPatient
                  appointment={appointment}
                  show={outpatientRecordShow}
                  setShow={setOutpatientRecordShow}
                />
                <MedicalHistory
                  show={showMedicalHistory}
                  setShow={setShowMedicalHistory}
                  appointment={appointment}
                />
                <StudyHistory
                  show={showStudiesHistory}
                  setShow={setShowStudiesHistory}
                  appointment={appointment}
                />
                <OrderHistory
                  show={showOrderHistory}
                  setShow={setShowOrderHistory}
                  appointment={appointment}
                />
              </>
            )}
          </div>
          <div
            className={`flex flex-row h-full w-full left-3/12 bg-white z-10 
            ${outpatientRecordShow || showStudiesHistory || showOrderHistory?
                'absolute inset-0 lg:left-10/12 md:left-full left-full opacity-25 cursor-default' :
                showMedicalHistory ?
                  'absolute inset-0 xl:left-7/12 lg:left-8/12 md:left-9/12 left-full opacity-25 cursor-default' :
                  ''
              }`}
            style={{ transition: 'left 0.5s linear, opacity 0.5s linear', top: `${ORGANIZATION_BAR + HEIGHT_BAR_STATE_APPOINTMENT}px` }}
            onClick={() => {
              if (outpatientRecordShow) setOutpatientRecordShow(false)
              if (showMedicalHistory) setShowMedicalHistory(false)
              if (showStudiesHistory) setShowStudiesHistory(false)
              if (showOrderHistory) setShowOrderHistory(false)
            }}
          >
            <div className='flex flex-col flex-1 h-full w-1/12' style={{ width: '5rem', pointerEvents: outpatientRecordShow || showMedicalHistory || showStudiesHistory || showOrderHistory ? 'none' : 'auto' }}>
              <SelectorSection
                setDynamicMenuSelector={(elem: any) => {
                  setDynamicMenuSelector(elem)
                }}
                prescriptions={prescriptions}
                appointment={appointment}
              />
            </div>
            <div className='aboslute h-full w-11/12' style={{ pointerEvents: outpatientRecordShow || showMedicalHistory ? 'none' : 'auto' }}>
              {/* {DynamicMenuSelector === 'P' ? (
                <PrescriptionMenu appointment={appointment} isFromInperson={true} />
              ) : DynamicMenuSelector === 'M' ? (
                <MedicalRecordSection appointment={appointment} setDisabledRedcordButton={setDisabledRedcordButton} />
              ) : (
                <LaboratoryMenu appointment={appointment} isFromInperson={true} />
              )} */}
              {/* DynamicMenuSelecot can be "M", "P", "L" or "U" for Medications, Prescriptions, Laboratory and Upload Studies */}
              {menuSelected[DynamicMenuSelector] ?? <></>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
