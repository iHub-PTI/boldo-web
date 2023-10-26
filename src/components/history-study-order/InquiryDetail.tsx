import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ReactComponent as Calendar } from '../../assets/calendar-detail.svg'
import { ReactComponent as ClipBoard } from '../../assets/clipboard.svg'
import { ReactComponent as LocationIcon } from '../../assets/location-on.svg'
import { ReactComponent as PresentialIcon } from '../../assets/modality/supervisor-account.svg'
import { ReactComponent as VideoCam } from '../../assets/modality/videocam.svg'
import { ReactComponent as PillIcon } from '../../assets/pill.svg'
import { ReactComponent as TestTube } from '../../assets/test-tube.svg'

import { getAppointment, getEncounterById, getStudyOrdersByEncounter } from '../../services/services'
import { countDays, toUpperLowerCase } from '../../util/helpers'
import NoProfilePicture from '../icons/NoProfilePicture'
import { getCategoryLabel } from './CardDetailStudy'

type AppointmentDetail = {
  dateAppointment: string | Date
  appointmentType: string
  organization: string
  doctor?: Omit<iHub.Doctor, 'specializations'> & { specializations: iHub.Specialization[] }
  patient?: iHub.Patient
}

export const InquiryDetail: React.FC<{ encounterId: string; patientId: string }> = props => {
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>(null)
  const [encounter, setEncounter] = useState<Boldo.Encounter & { startTimeDate: string }>(null)
  const [studyOrders, setStudyOrders] = useState<Boldo.OrderStudy[]>([])
  const [loading, setLoading] = useState(false)

  const getOriginData = async (encounterId: string, patientId: string) => {
    try {
      setLoading(true)
      const encounterRes = await getEncounterById(encounterId, patientId)
      setEncounter(encounterRes.data ?? null)
      if (!encounterRes.data.appointmentId) throw new Error('No se encontro una cita o ocurrió un error inesperado.')
      const appointmentRes = await getAppointment(encounterRes.data.appointmentId)
      const {
        appointmentType = '',
        organization = null,
        doctor = null,
        patient = null,
        start = '',
      } = appointmentRes.data
      setAppointmentDetail({
        dateAppointment: start === '' ? 'Fecha Desconocida.' : start,
        appointmentType: appointmentType === 'V' ? 'Virtual' : 'Presencial',
        organization: organization?.name ? organization?.name : 'Desconocido',
        doctor: doctor,
        patient: patient,
      })
      const studyOrders = await getStudyOrdersByEncounter(encounterId, props.patientId)
      setStudyOrders(studyOrders.data ?? [])
    } catch (error) {
      //TODO: Agregar manejador de error
      setAppointmentDetail(null)
      setEncounter(null)
      setStudyOrders([])
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOriginData(props.encounterId, props.patientId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col'>
      {loading ? (
        <p className='flex flex-row justify-center'>Cargando...</p>
      ) : (
        <section>
          <article className='p-4'>
            <ul>
              <li className='flex flex-row gap-2 items-center'>
                <span className='p-1'>
                  <Calendar className='m-0' />
                </span>
                <span className='text-sm leading-4 text-dark-cool'>
                  {moment(appointmentDetail?.dateAppointment).format('DD/MM/YYYY')}
                </span>
                <span className='text-gray-500 text-sm leading-4'>
                  {countDays(appointmentDetail?.dateAppointment as string)}
                </span>
              </li>
              <li className='flex flex-row gap-2 items-center'>
                {appointmentDetail?.appointmentType !== 'Virtual' ? (
                  <span className='p-1'>
                    <PresentialIcon className='fill-current text-primary-500' />
                  </span>
                ) : (
                  <span className='p-1'>
                    <VideoCam className='fill-current text-orange-dark' />
                  </span>
                )}
                <span className='text-sm leading-4 text-dark-cool'>Modalidad</span>
                <span className='text-sm leading-4 text-gray-500'>{appointmentDetail?.appointmentType}</span>
              </li>
              <li className='flex flex-row gap-2 items-center'>
                <span className='p-1'>
                  <LocationIcon className='fill-current text-primary-500' />
                </span>
                <span className='text-sm leading-4 text-dark-cool'>
                  Realizado en
                  <span className='text-gray-500 leading-4'> {appointmentDetail?.organization}</span>
                </span>
              </li>
            </ul>
          </article>

          <article className='p-2'>
            <h4 className='text-primary-500 leading-4 font-sans text-sm'>Diagnóstico</h4>
            <span className='font-semibold leading-4 text-sm text-black'>{encounter?.diagnosis}</span>
          </article>

          <article className='p-2 flex flex-row items-center gap-36'>
            {appointmentDetail?.doctor && (
              <div className='space-y-2'>
                {appointmentDetail?.doctor?.photoUrl ? (
                  <img
                    src={appointmentDetail?.doctor.photoUrl}
                    alt='Foto de perfil del doctor'
                    className='rounded-full w-13 h-13 border-1 bg-gray-500 object-cover'
                  />
                ) : (
                  <NoProfilePicture className='rounded-full w-13 h-13 border-1 bg-gray-500' />
                )}
                <div className='flex flex-col'>
                  <span className='text-sm leading-4 text-dark-cool'>
                    {appointmentDetail?.doctor?.gender?.toLocaleLowerCase() !== 'male' ? 'Dra. ' : 'Dr. '}
                    {toUpperLowerCase(appointmentDetail?.doctor?.givenName?.split(' ')[0]) + ' '}
                    {toUpperLowerCase(appointmentDetail?.doctor?.familyName?.split(' ')[0])}
                  </span>
                  <span className='text-primary-500 leading-4 font-sans text-sm font-semibold flex flex-col'>
                    {appointmentDetail?.doctor?.specializations?.map((spec, idx) => {
                      return <span key={'spec' + idx}>{toUpperLowerCase(spec.description)}</span>
                    })}
                  </span>
                </div>
              </div>
            )}
            {appointmentDetail?.patient && (
              <div className='space-y-2'>
                {appointmentDetail?.patient?.photoUrl ? (
                  <img
                    src={appointmentDetail?.patient?.photoUrl}
                    alt='Foto de perfil del doctor'
                    className='rounded-full w-13 h-13 border-1 bg-gray-500 object-cover'
                  />
                ) : (
                  <NoProfilePicture className='rounded-full w-13 h-13 border-1 bg-gray-500' />
                )}
                <div className='flex flex-col'>
                  <span className='text-sm leading-4 text-dark-cool'>
                    {toUpperLowerCase(appointmentDetail?.patient?.givenName?.split(' ')[0]) + ' '}
                    {toUpperLowerCase(appointmentDetail?.patient?.familyName?.split(' ')[0])}
                  </span>
                  <span className='text-primary-500 leading-4 font-sans text-sm font-semibold'>Paciente</span>
                </div>
              </div>
            )}
          </article>

          <div className='flex flex-col gap-3'>
            <article className='p-2 bg-white rounded-lg shadow-md'>
              <div className='flex flex-row items-center gap-1'>
                <ClipBoard className='w-3 h-3 fill-current text-dark-cool' />
                <span className='text-xs text-dark-cool'>Notas</span>
              </div>
              <div className='pt-2 pl-2'>
                {encounter?.soep.plan ? (
                  <>
                    <h4 className='text-sm leading-4'>Plan</h4>
                    <p className='text-sm font-light leading-6'>{encounter?.soep?.plan}</p>
                  </>
                ) : (
                  <h4 className='text-sm leading-4'>No se ha registrado un plan.</h4>
                )}
              </div>
            </article>

            <article className='p-2 bg-white rounded-lg mt-1 shadow-md'>
              <div className='flex flex-row items-center gap-1'>
                <PillIcon className='w-3 h-3 text-dark-cool fill-current' />
                <span className='text-xs text-dark-cool'>Recetas</span>
              </div>
              <span className='block pl-2 pt-2'>
                {encounter?.prescriptions?.length === 0 ? (
                  <h4 className='text-sm leading-4'>No se han registrado recetas. </h4>
                ) : (
                  encounter?.prescriptions?.map((pres, idx) => {
                    return (
                      <div key={idx + '_medication_section'}>
                        <div className='flex flex-row items-center gap-1'>
                          <span className='bg-primary-500 rounded-full' style={{ width: '5px', height: '5px' }}></span>
                          <span className='text-xs leading-4 font-normal' style={{ color: '#424649' }}>
                            {pres.medicationName}
                          </span>
                        </div>
                        <span className='pl-2 text-xs' style={{ color: '#707882' }}>
                          {pres.instructions ?? ''}
                        </span>
                      </div>
                    )
                  })
                )}
              </span>
            </article>
            <article className='p-2 bg-white rounded-lg mt-1 shadow-md'>
              <div className='flex flex-row items-center gap-1'>
                <TestTube className='w-3 h-3 text-dark-cool fill-current' />
                <span className='text-xs text-dark-cool'>Órdenes de estudio</span>
              </div>
              <span className='block pl-2 pt-2'>
                {studyOrders?.length === 0 ? (
                  <h4 className='text-sm leading-4'>No se registraron órdenes de estudio.</h4>
                ) : (
                  studyOrders?.map((studyOrder, idx) => {
                    return (
                      <div key={idx + '_study_order_section'}>
                        <div className='flex flex-row items-center gap-1'>
                          <span className='bg-primary-500 rounded-full' style={{ width: '5px', height: '5px' }}></span>
                          <span className='text-xs leading-4 font-normal' style={{ color: '#424649' }}>
                            {getCategoryLabel(studyOrder?.category)}
                          </span>
                        </div>
                        <span className='pl-2 text-xs' style={{ color: '#707882' }}>
                          {studyOrder?.studiesCodes?.map(studies => studies.display).join(', ')}
                        </span>
                      </div>
                    )
                  })
                )}
              </span>
            </article>
          </div>
        </section>
      )}
    </div>
  )
}
