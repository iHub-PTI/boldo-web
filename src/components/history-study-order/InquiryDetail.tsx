import React, { useEffect, useState } from 'react'
import { getAppointment, getEncounter } from '../../services/services'
import moment from 'moment'

type AppointmentDetail = {
  dateAppointment: Date | string
  appointmentType: string
  organization: string
}

export const InquiryDetail = () => {
  const id = '37108'
  const [appointmentDetail, setAppointmentDetail] = useState<AppointmentDetail>(null)
  const [encounter, setEncounter] = useState<Boldo.Encounter>()
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
        setEncounter(res.data)
        setLoadingEnc(false)
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
        <>
          <ul>
            <li>{appointmentDetail?.dateAppointment}</li>
            <li>{appointmentDetail?.appointmentType}</li>
            <li>{appointmentDetail?.organization}</li>
          </ul>
          <div>Diagnóstico</div>
          <p>{encounter?.diagnosis}</p>
          <div>Notas</div>
          <p>{encounter?.soep?.plan}</p>
          <p>{encounter?.soep?.subjective}</p>
          <p>{encounter?.soep?.objective}</p>
          <p>{encounter?.soep?.evaluation}</p>
          <div>{encounter?.prescriptions}</div>
        </>
      )}
    </div>
  )
}
