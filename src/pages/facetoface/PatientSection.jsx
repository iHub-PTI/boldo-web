import React, { useCallback, useEffect, useState } from 'react'
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'

import useWindowDimensions from '../../util/useWindowDimensions'

const mapSexo = gender => {
  switch ((gender || 'male').trim().toLowerCase()) {
    case 'female':
      return 'Femenino'
    case 'f':
      return 'Femenino'
    case 'male':
      return 'Masculino'
    case 'm':
      return 'Masculino'
    default:
      return gender
  }
}

const PatientRecord = props => {
  const { _, width: screenWidth } = useWindowDimensions()
  const [imgSize, setImgSize] = useState(200)
  useEffect(() => {
    if (screenWidth < 900) {
      setImgSize(120)
    } else if (screenWidth < 1350) {
      setImgSize(150)
    } else {
      setImgSize(200)
    }
  }, [screenWidth])
  return (
    <Grid style={{ padding: '15px' }}>
      <Typography variant='body1' color='textSecondary'>
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
        src={'https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png'}
      >
        {/* <PatientIcon /> */}
      </Avatar>
      {/* <Grid item style={{ marginTop: '20px' }}>
        <PatientIcon />
      </Grid> */}

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body1' color='textPrimary'>
          Jaime Francisco Aguayo González
        </Typography>
        <Typography variant='body1' color='textSecondary'>
          CI 5414921
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Nacimiento
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          33 años
          {/* {moment().diff(value.fechaNac, 'years')} años */}
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Teléfono
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          0973 1435143
        </Typography>
      </Grid>

      <Grid item style={{ marginTop: '20px' }}>
        <Typography variant='body2' color='textSecondary'>
          Ciudad
        </Typography>
        <Typography variant='body1' color='textPrimary'>
          Caacupé
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
              <svg  className='w-6 h-6 ml-3' width='21' height='20' viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
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
export default () => {
  // const paciente = useSelector(
  //   (state) => state.admin.farmaceutico.paciente
  // );
  // const medicamentos = useSelector(
  //   (state) => state.admin.farmaceutico.medicamentos
  // );

  // if (paciente.value === undefined) {
  //   return <Grid></Grid>;
  // }
  return (
    <>
      <Card
        style={{
          backgroundColor: '#F4F5F7',
          // borderTopRightRadius: '20px',
          // borderBottomRightRadius: '20px',
          height: '90vh',
        }}
      >
        <CardContent>
          {/* <ResourceRender
            resource={paciente}
            Data={PatientRecord}
            Error={() => ''}
            Empty={() => ''}
            Query={() => ''}
          />
        */}
          <PatientRecord />
        </CardContent>
      </Card>
    </>
  )
}
