import { Box, Card, CardContent, Grid, TextField, Typography } from '@material-ui/core'
import MaterialTable from 'material-table'
// import tableIcons from "./MaterialTableIcons";
import axios from 'axios'

import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Countdown from '../util/countdown'
import loading from '../assets/loading.gif'
import TimeAgo from 'react-timeago'
import spanishStrings from 'react-timeago/lib/language-strings/es'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(spanishStrings)

const ValidatePatient = () => {
  const [data, setData] = useState([])

  const [PatientsList, setPatientsList] = useState([])

  const [showHover, setShowHover] = useState('')

  const [showCounter, setCounter] = useState('')

  const [userFilter, setUserFilter] = useState('')

  useEffect(() => {
    const effect = async () => {
      try {
        const res = await axios.get('/inactive')
        var count = Object.keys(res.data).length
        for (var i = 0; i < count; i++) {
          const patient = res.data[i]
          setPatientsList(data => [...data, patient])
        }
      } catch (err) {
        console.log(err)
      }
    }
    effect()
  }, [])

  useEffect(() => {
    setData(PatientsList)
  }, [PatientsList])

  useEffect(() => {
    if (userFilter) {
      const tempArray = PatientsList.filter(
        item =>
          item.firstName.toLowerCase().match(userFilter.toLowerCase(), 'g') ||
          item.lastName.toLowerCase().match(userFilter.toLowerCase(), 'g') ||
          item.username.toLowerCase().match(userFilter.toLowerCase(), 'g')
      )
      setData(tempArray)
    } else {
      setData(PatientsList)
    }
  }, [userFilter, PatientsList])

  const columns = [
    {
      title: 'Nombre',
      width: '40%',
      field: 'imageUrl',
      cellStyle: (e, rowData) => {
        if (rowData.emailVerified === true) {
          return { background: '#D4F2F3' }
        }
      },
      headerStyle: {
        color: '#575D64',
        fontSize: '17px',
      },
      render: rowData => {
        const manageUserAccess = () => {
          if (!rowData.emailVerified && showCounter === '') {
            return validateBtn()
          }
        }
        const validateBtn = () => (
          <div className='flex mt-4 md:mt-0 md:ml-4'>
            <span className='ml-3 rounded-md shadow-sm'>
              <button
                type='button'
                className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                onClick={e => {
                  setCounter(rowData.username)
                  let newArray = data.filter(item => rowData.username !== item.username)
                  newArray.push({ ...rowData, emailVerified: true })
                  newArray.sort(function (a, b) {
                    return a.emailVerified - b.emailVerified
                  })
                  setData(newArray)
                }}
              >
                habilitar
              </button>
            </span>
          </div>
        )

        return (
          <Grid
            style={{ width: '450px' }}
            onMouseEnter={() => setShowHover(rowData.username)}
            onMouseLeave={() => setShowHover('')}
            container
          >
            {/* <img src={rowData.imageUrl} style={{ width: 40, borderRadius: '50%' }} /> */}
            <Grid style={{ padding: '10px' }}>
              {rowData.firstName} {rowData.lastName}
            </Grid>
            <Grid>{rowData.username === showHover ? manageUserAccess() : <> </>}</Grid>
          </Grid>
        )
      },
    },

    {
      title: 'C.I',
      field: 'id',
      width: '30%',
      // type: 'numeric',
      headerStyle: {
        color: '#575D64',
        fontSize: '17px',
      },
      cellStyle: (e, rowData) => {
        if (rowData.emailVerified === true) {
          return { background: '#D4F2F3' }
        }
      },
      render: rowData => {
        return showCounter === rowData.username ? (
          <Grid style={{ width: '130px' }} container>
            <img src={loading} width='30px' alt='loading...' /> <p style={{ marginTop: '3px' }}>habilitando...</p>{' '}
          </Grid>
        ) : (
          <p onMouseEnter={() => setShowHover(rowData.username)} onMouseLeave={() => setShowHover('')}>
            {rowData.username}
          </p>
        )
      },
    },
    {
      title: 'Fecha de Regis',
      width: '30%',
      type: 'numeric',
      field: 'id',
      headerStyle: {
        color: '#575D64',
        fontSize: '17px',
      },
      cellStyle: (e, rowData) => {
        if (rowData.emailVerified === true) {
          return { background: '#D4F2F3' }
        }
      },
      render: rowData => {
        const handleValidate = async () => {
          try {
            const payload = {
              username: rowData.username,
            }
            await axios.post(`/user/validate`, payload)
          } catch (err) {
            console.log(err)
            // if (err?.response?.status !== 401) setError(true)
          }
        }
        return showCounter === rowData.username ? (
          <Countdown
            setDataCallback={elem => {
              if (elem === 'cancel') {
                setCounter('')
                let newArray = data.filter(item => rowData.username !== item.username)
                newArray.push({ ...rowData, emailVerified: false })
                newArray.sort(function (a, b) {
                  return a.emailVerified - b.emailVerified
                })
                setData(newArray)
              } else if (elem === 'send') {
                setCounter('')
                handleValidate()
              }
            }}
          />
        ) : rowData.emailVerified === true ? (
          <>
            <p>Habilitado</p>
          </>
        ) : (
          <Grid style={{ textAlign: 'end' }}>
            <TimeAgo date={rowData.kcCreatedTime} formatter={formatter} />
          </Grid>
        )
      },
    },
  ]

  const prescriptionTextBox = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    boxSizing: 'border-box',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  }
  return (
    <Layout>
      <Box display='flex' justifyContent='center' alignItems='center' style={{ marginTop: '10%' }}>
        <Grid item xs={9}>
          <Card elevation={6} style={{ borderRadius: '15px' }}>
            <CardContent>
              <Typography style={{ color: '#27BEC2' }} gutterBottom variant='h4' component='h2'>
                Validar registro de pacientes
              </Typography>
              <Grid style={{ marginTop: '10px' }} container direction='row' alignItems='center'>
                <Grid style={{ paddingLeft: '5px', marginTop: '5px' }} item>
                  Número de cédula
                </Grid>
              </Grid>
              <Grid style={{ marginTop: '5px' }}>
                <TextField
                  InputProps={{
                    disableUnderline: true,
                  }}
                  inputProps={{ style: { padding: '8px' } }}
                  style={prescriptionTextBox}
                  value={userFilter}
                  onChange={event => {
                    setUserFilter(event.target.value)
                  }}
                />
              </Grid>
              {data.length > 0 && (
                <MaterialTable
                  style={{ marginTop: '15px' }}
                  options={{
                    search: false,
                    showTitle: false,
                    toolbar: false,
                    paging: false,
                    draggable: false,
                  }}
                  columns={columns}
                  data={data}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Layout>
  )
}
export default ValidatePatient
