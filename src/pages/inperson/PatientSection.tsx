import React, { useEffect, useState } from 'react'
import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import { useHistory, useRouteMatch } from 'react-router-dom'

import { useToasts } from '../../components/Toast'
import useWindowDimensions from '../../util/useWindowDimensions'
import SelectorSection from './SelectorSection'
import moment from 'moment'


// const mapSexo = gender => {
//   switch ((gender || 'male').trim().toLowerCase()) {
//     case 'female':
//       return 'Femenino'
//     case 'f':
//       return 'Femenino'
//     case 'male':
//       return 'Masculino'
//     case 'm':
//       return 'Masculino'
//     default:
//       return gender
//   }
// }

const PatientRecord = props => {

  const { givenName, familyName, birthDate, identifier, city = '', phone = '' } = props.patient;

  const { width: screenWidth } = useWindowDimensions()
  const [imgSize, setImgSize] = useState(180)
  useEffect(() => {
    if (screenWidth < 900) {
      setImgSize(120)
    } else if (screenWidth < 1350) {
      setImgSize(150)
    } else {
      setImgSize(180)
    }
  }, [screenWidth])
  return (
    <Grid style={{ padding: '15px' }}>
      <Typography variant='body1' color='textPrimary'>
        Paciente
      </Typography>
      <Avatar
        style={{
          marginTop: '20px',
          width: `${imgSize}px`,
          height: `${imgSize}px`,
          borderRadius: '10px',
        }}
        variant='square'
        src={'/img/patient-m.svg'}
      >
        {/* <PatientIcon /> */}
      </Avatar>
      {/* <Grid item style={{ marginTop: '20px' }}>
        <PatientIcon />
      </Grid> */}

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body1' color='textPrimary'>
          {givenName} {' '} {familyName}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          CI {identifier}
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Nacimiento
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          {/* 33 años */}
          {moment().diff(birthDate, 'years')} años
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Teléfono
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          {phone}
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Ciudad
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          {city}
        </Typography>
      </Grid>
      <Grid item style={{ marginTop: '60px' }}>
        <div className='flex mt-4 md:mt-0 md:ml-4'>
          <span className='ml-3 rounded-md shadow-sm'>
            <button
              type='button'
              className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
              onClick={e => {
                // e.stopPropagation()
                // dispatch({ type: 'reset' })
                // setError('')
                // setShowEditModal(true)
              }}
            >
              Seguimiento
              <svg
                className='w-6 h-6 ml-3'
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M5.79279 7.29302C5.98031 7.10555 6.23462 7.00023 6.49979 7.00023C6.76495 7.00023 7.01926 7.10555 7.20679 7.29302L10.4998 10.586L13.7928 7.29302C13.885 7.19751 13.9954 7.12133 14.1174 7.06892C14.2394 7.01651 14.3706 6.98892 14.5034 6.98777C14.6362 6.98662 14.7678 7.01192 14.8907 7.0622C15.0136 7.11248 15.1253 7.18673 15.2192 7.28062C15.3131 7.37452 15.3873 7.48617 15.4376 7.60907C15.4879 7.73196 15.5132 7.86364 15.512 7.99642C15.5109 8.1292 15.4833 8.26042 15.4309 8.38242C15.3785 8.50443 15.3023 8.61477 15.2068 8.70702L11.2068 12.707C11.0193 12.8945 10.765 12.9998 10.4998 12.9998C10.2346 12.9998 9.98031 12.8945 9.79279 12.707L5.79279 8.70702C5.60532 8.51949 5.5 8.26518 5.5 8.00002C5.5 7.73486 5.60532 7.48055 5.79279 7.29302V7.29302Z'
                  fill='white'
                />
              </svg>
            </button>
          </span>
        </div>
      </Grid>
    </Grid>
  )
}
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

export default () => {
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  const history = useHistory()
  const { addErrorToast } = useToasts()
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await axios.get<AppointmentWithPatient & { token: string }>(`/profile/doctor/appointments/${id}`)
        if (mounted) setAppointment(res.data)
      } catch (err) {
        console.log(err)
        if (mounted) {
          addErrorToast('¡Fallo en la carga de la cita!')
          history.replace(`/`)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [addErrorToast, id, history])


  return (
    <Grid container>
      <Grid xs={9} item>
        <Card
          style={{
            backgroundColor: '#F4F5F7',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
            height: '90vh',
          }}
        >
          <CardContent>

            {appointment !== undefined ? <PatientRecord patient={appointment.patient} /> : <div style={{ width: '300px' }} className='flex items-center justify-center pr-15 py-64'>
              <div className='flex items-center justify-center  mx-auto bg-gray-100 rounded-full'>
                <svg
                  className='w-6 h-6 text-secondary-500 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              </div>
            </div>}

          </CardContent>
        </Card>
      </Grid>
      <Grid xs={3} item >
        <SelectorSection />
      </Grid>
    </Grid>
  )
}
