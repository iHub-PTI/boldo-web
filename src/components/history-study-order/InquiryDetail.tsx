import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ReactComponent as Calendar } from '../../assets/calendar-detail.svg'
import { ReactComponent as LocationIcon } from '../../assets/location-on.svg'
import { ReactComponent as PresentialIcon } from '../../assets/modality/supervisor-account.svg'
import { ReactComponent as VideoCam } from '../../assets/modality/videocam.svg'
import { ReactComponent as PillIcon } from '../../assets/pill.svg'
import { ReactComponent as ClipBoard } from '../../assets/clipboard.svg'

import { getAppointment, getEncounter } from '../../services/services'
import { countDays } from '../../util/helpers'
import NoProfilePicture from '../icons/NoProfilePicture'

type AppointmentDetail = {
  dateAppointment: string | Date
  appointmentType: string
  organization: string
}

export const InquiryDetail = () => {
  const id = '37108'
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>(null)
  const [encounter, setEncounter] = useState<Boldo.Encounter>(null)
  const [loadingApp, setLoadingApp] = useState(false)
  const [loadingEnc, setLoadingEnc] = useState(false)

  useEffect(() => {
    setLoadingApp(true)
    setLoadingEnc(true)
    getAppointment(id)
      .then(res => {
        const { start = '', appointmentType = '', organization = null } = res.data
        setAppointmentDetail({
          dateAppointment: start !== '' || undefined ? moment(start).format('DD/MM/YYYY') : '',
          appointmentType: appointmentType === 'V' ? 'Virtual' : 'Presencial',
          organization: organization?.name ? organization?.name : 'Desconocido',
        })
      })
      .catch(error => {
        //TODO: agregar manejador de Error
        setAppointmentDetail(null)
        return null
      })
      .finally(() => {
        setLoadingApp(false)
      })

    getEncounter(id)
      .then(res => {
        setEncounter(res.data.encounter ?? null)
      })
      .catch(error => {
        //TODO: agregar manejador de Error
        setEncounter(null)
        return null
      })
      .finally(() => {
        setLoadingEnc(false)
      })
  }, [])

  return (
    <div className='flex flex-col'>
      {loadingApp && loadingEnc ? (
        <p>Cargando...</p>
      ) : (
        <section>
          <article className='p-4'>
            <ul>
              <li className='flex flex-row gap-2 items-center'>
                <Calendar className='m-0' />
                <span className='text-sm leading-4 text-dark-cool'>{appointmentDetail?.dateAppointment}</span>
                <span className='text-gray-500 text-sm leading-4'>
                  {countDays(appointmentDetail?.dateAppointment.toString())}
                </span>
              </li>
              <li className='flex flex-row gap-2 items-center'>
                {appointmentDetail?.appointmentType !== 'Virtual' ? (
                  <span>
                    <PresentialIcon className='fill-current text-primary-500' />
                  </span>
                ) : (
                  <span>
                    <VideoCam className='fill-current text-orange-dark' />
                  </span>
                )}
                <span className='text-sm leading-4 text-dark-cool'>Modalidad</span>
                <span className='text-sm leading-4 text-gray-500'>{appointmentDetail?.appointmentType}</span>
              </li>
              <li className='flex flex-row gap-2 items-center'>
                <span>
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
            <div className='space-y-2'>
              <NoProfilePicture className='rounded-full w-13 border-1 bg-gray-500' />
              <div className='flex flex-col'>
                <span className='text-sm leading-4 text-dark-cool'>Dr. Julio Recalde</span>
                <span className='text-primary-500 leading-4 font-sans text-sm font-semibold'>Médico Cardiólogo</span>
              </div>
            </div>
            <div className='space-y-2'>
              <NoProfilePicture className='rounded-full w-13 border-1 bg-gray-500' />
              <div className='flex flex-col'>
                <span className='text-sm leading-4 text-dark-cool'>Rebeca Nogales</span>
                <span className='text-primary-500 leading-4 font-sans text-sm font-semibold'>Paciente</span>
              </div>
            </div>
          </article>

          <div className='flex flex-col gap-3'>
            <article className='p-2 bg-white rounded-lg'>
              <div className='flex flex-row items-center'>
                <ClipBoard className='w-3 h-3 fill-current text-dark-cool' />
                <span className='text-xs text-dark-cool'>Notas</span>
              </div>
              <div className='pt-2'>
                <h4 className='text-sm leading-4'>Plan</h4>
                <span>{encounter?.soep?.plan}</span>
              </div>
            </article>

            <article className='p-2 bg-white rounded-lg mt-2'>
              <div className='flex flex-row items-center'>
                <PillIcon className='w-3 h-3 text-dark-cool fill-current' />
                <span className='text-xs text-dark-cool'>Recetas</span>
              </div>
              <span className='pt-2'>
                {encounter?.prescriptions.map((pres, idx) => {
                  return (
                    <div key={idx + '_medication_section'}>
                      <div className='flex flex-row items-center gap-1'>
                        <span className='bg-primary-500 rounded-full' style={{ width: '5px', height: '5px' }}></span>
                        <span className='text-xs leading-4 font-normal' style={{ color: '#424649' }}>
                          {pres.medicationName}
                        </span>
                      </div>
                      <span className='pl-2 text-xs' style={{ color: '#707882' }}>
                        Caja de 20 comprimidos
                      </span>
                    </div>
                  )
                })}
              </span>
            </article>
            <article></article>
          </div>
        </section>
      )}
    </div>
  )
}
