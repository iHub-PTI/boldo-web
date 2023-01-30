import React, { useEffect, useState } from 'react'
import { Avatar, Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import { useRouteMatch } from 'react-router-dom'
import moment from 'moment'
import { useToasts } from '../../components/Toast'
import useWindowDimensions from '../../util/useWindowDimensions'
import UserCircle from "../../components/icons/patient-register/UserCircle";
import { HEIGHT_NAVBAR, HEIGHT_BAR_STATE_APPOINTMENT, WIDTH_XL } from "../../util/constants"


const PatientRecord = (props) => {
  const { givenName, familyName, birthDate, identifier, city = '', phone = '', photoUrl = '' } = props.patient;


  const { width: screenWidth } = useWindowDimensions()
  //const { addErrorToast, addToast } = useToasts()
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
    <div className='flex flex-col flex-1' style={{ padding: '15px' }}>
      <Typography variant='body1' color='textSecondary'>
        Paciente
      </Typography>
      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar
          style={{
            marginTop: '20px',
            width: `${imgSize}px`,
            height: `${imgSize}px`,
            borderRadius: '100px',
          }}
          variant='square'
          src={photoUrl}
        >
        </Avatar>
      </Grid>

      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
        item style={{ marginTop: '20px' }}>
        <Typography variant='body1' color='textPrimary'>
          {givenName} {' '} {familyName}
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          {identifier == null || identifier.includes('-')
            ? 'Paciente sin cédula'
            : 'CI ' + identifier}
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Edad
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

      <div className='flex justify-center mt-10'>
        <button
          className='focus:outline-none p-2 hover:bg-cool-gray-100 transition-colors delay-200 disabled:cursor-not-allowed'
          onClick={() => props.showPatientRecord()}
          //FIXME:  comments in the file on line 23 InPersonAppointment.tsx
          disabled={props.disabledRedcordButton}
        >
          <div className={`text-gray-500 flex flex-row justify-center items-center ${props.outpatientRecord && 'text-primary-600 font-semibold'}`}> <UserCircle fill={`${props.outpatientRecord ? '#13A5A9' : '#6B7280'}`} className='mr-1' />  Registro Ambulatorio</div>
        </button>
      </div>
    </div>
  )
}



export default (props) => {

  const { appointment } = props;
  //const history = useHistory()
  const { addErrorToast } = useToasts()
  const [encounter, setEncounter] = useState<{}>();
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  const { width: screenWidth } = useWindowDimensions()



  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`);
        setEncounter(res.data.encounter)
        // setInitialLoad(false)
      } catch (err) {
        console.log(err)
        // setInitialLoad(false)
        //@ts-ignore
        addErrorToast(err)
      }
    }

    load()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className='flex flex-col h-full overflow-y-auto scrollbar'
      style={{
        backgroundColor: '#F4F5F7',
        height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`}`
      }}
    >
      {appointment !== undefined && encounter !== undefined ?
        <PatientRecord
          patient={appointment.patient}
          encounter={encounter}
          id={id}
          appointment={appointment}
          outpatientRecord={props.outpatientRecord}
          showPatientRecord={props.showPatientRecord}
          disabledRedcordButton={props.disabledRedcordButton}
        /> :
        <div className='flex h-full justify-center items-center'>
          <div className='bg-gray-100 rounded-full'>
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
    </div>
  )

}
