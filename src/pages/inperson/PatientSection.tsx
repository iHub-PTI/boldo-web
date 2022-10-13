import React, { useEffect, useState } from 'react'
import { Avatar, Button, Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import { useHistory, useRouteMatch } from 'react-router-dom'
import MaterialTable from 'material-table'
import moment from 'moment'
import useStyles from './style'

import { useToasts } from '../../components/Toast'
import useWindowDimensions from '../../util/useWindowDimensions'
import Modal from '../../components/Modal'
import loading from '../../assets/loading.gif'
import { Icons } from 'material-table';
import { forwardRef } from 'react';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import AddBox from '@material-ui/icons/AddBox';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const PatientRecord = props => {

  const { givenName, familyName, birthDate, identifier, city = '', phone = '', photoUrl = '' } = props.patient;
  const { encounterId, diagnose = '', instructions = '', prescriptions = [], soep = {}, mainReason = '', appointmentId, status = '' } = props.encounter;
  const { width: screenWidth } = useWindowDimensions()
  const { addErrorToast, addToast } = useToasts()
  const [imgSize, setImgSize] = useState(180)
  const [showEditModal, setShowEditModal] = useState(false)
  const [soepHistory, setSoepHistory] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const [isAppointmentDisabled, setAppointmentDisabled] = useState(true)
  const classes = useStyles()

  const tableIcons: Icons = {
    SortArrow: forwardRef((props, ref) => <ArrowUpward style={{ color: "#13A5A9" }} {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  }

  useEffect(() => {
    if (props.appointment === undefined || props.appointment.status === 'locked' || props.appointment.status === 'upcoming') {
      setAppointmentDisabled(true);
    } else {
      setAppointmentDisabled(false);
    }    
  }, [props.appointment]);

  useEffect(() => {
    if (screenWidth < 900) {
      setImgSize(120)
    } else if (screenWidth < 1350) {
      setImgSize(150)
    } else {
      setImgSize(180)
    }
  }, [screenWidth])

  useEffect(() => {
    //send encounter selected to server
    if (selectedRow) {
      setIsLoading(true)
      const send = async () => {
        const encounter = {
          encounterData: {
            diagnosis: diagnose,
            instructions: instructions,
            prescriptions: prescriptions,
            mainReason: mainReason,
            //@ts-ignore
            partOfEncounterId: selectedRow.id,
            encounterClass: 'A',
            soep: soep
          },

        }

        try {
          await axios.put(`/profile/doctor/appointments/${props.id}/encounter`, encounter);
          addToast({ type: 'success', title: 'Ficha médica asociada con éxito', text: '' })
          setIsLoading(false)
          history.go(0)
        } catch (error) {
          console.log(error)
          //@ts-ignore
          addErrorToast(error)
          setIsLoading(false)
        }


      }
      send()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])

  useEffect(() => {
    if (showEditModal === true) {
      // get encounters list
      const load = async () => {
        try {
          const res = await axios.get(`/profile/doctor/relatedEncounters/Patient/${identifier}/filterEncounterId/${encounterId}`);
          if (res.data.encounter !== undefined) {
            var count = Object.keys(res.data.encounter).length
            const tempArray = []
            for (var i = 0; i < count; i++) {
              const data = res.data.encounter[i][0]
              data.startTimeDate = moment(data.startTimeDate).format('DD/MM/YYYY')
              if (data.appointmentId !== appointmentId)
                tempArray.push(data)
            }
            setSoepHistory(tempArray);
          }
        } catch (error) {
          console.log(error)
          // //@ts-ignore
          // addErrorToast(error)
        }

      }
      load();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditModal])

  return (
    <Grid style={{ padding: '15px' }}>
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
          {/* <PatientIcon /> */}
        </Avatar>
      </Grid>
      {/* <Grid item style={{ marginTop: '20px' }}>
        <PatientIcon />
      </Grid> */}

      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
        item style={{ marginTop: '20px' }}>
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
      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
        item style={{ marginTop: '60px' }}>
        <div className='flex mt-4 md:mt-0 md:ml-4'>
          <span className='ml-3 rounded-md shadow-sm'>
            <Button
              style={{ border: 'none',outline:'none' }}
              disabled={isAppointmentDisabled}
              className={classes.muiButtonContained}
              variant='contained'
              endIcon={
                (
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
                )
              }
              onClick={e => {
                setShowEditModal(true)
              }}
            >
              { Object.entries(props.encounter.soep).length === 0 ? 'Primera Consulta' : 'Seguimiento'}
            </Button>
          </span>
        </div>

        <Modal show={showEditModal} setShow={setShowEditModal} size='xl3' >
          <Typography variant="body1" color="textSecondary">
            Paciente
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {givenName} {familyName}
          </Typography>

          <Typography style={{ marginBottom: '15px' }} variant="subtitle2" color="textSecondary">
            CI: {identifier}
          </Typography>

          <MaterialTable
          title='Seleccionar consulta'
           localization={{
                      body: {
                        emptyDataSourceMessage: 'No hay datos por mostrar',
                      },
                      pagination: {
                        firstAriaLabel: 'Primera página',
                        firstTooltip: 'Primera página',
                        labelDisplayedRows: '{from}-{to} de {count}',
                        labelRowsPerPage: 'Filas por página:',
                        labelRowsSelect: 'filas',
                        lastAriaLabel: 'Ultima página',
                        lastTooltip: 'Ultima página',
                        nextAriaLabel: 'Pagina siguiente',
                        nextTooltip: 'Pagina siguiente',
                        previousAriaLabel: 'Pagina anterior',
                        previousTooltip: 'Pagina anterior',
                     },
                     toolbar: {
                      searchPlaceholder: 'Buscar',
                      searchTooltip: 'Buscar',
                    }}}
            icons={tableIcons}
            columns={[
              {
                title: "Fecha",
                field: "startTimeDate",
              },
              {
                title: "Motivo de visita",
                field: "mainReason"
              },
              // {
              //   title: "Diagnóstico",
              //   field: "diagnosis"
              // },
              {
                title: 'Diagnóstico',
                field: 'diagnosis',
                render: rowData => {
                  //@ts-ignore
                  return isLoading === true && selectedRow !== undefined && selectedRow.id === rowData.id ? (
                    <Grid style={{ width: '130px' }} container>
                      <img src={loading} width='30px' alt='loading...' /> <p style={{ marginTop: '3px' }}>habilitando...</p>{' '}
                    </Grid>
                  ) : (
                    <p>
                      {rowData.diagnosis}
                    </p>
                  )
                },
              },

            ]}
            data={soepHistory}
            onRowClick={(evt, selectedRow) =>
              //@ts-ignore
              setSelectedRow(selectedRow)
            }
            options={{
              search: true,
              toolbar: true,
              paging: true,
              draggable: false,
              pageSize: 5,

              rowStyle: (rowData) => ({
                backgroundColor:
                  // @ts-ignore
                  selectedRow !== undefined && selectedRow.id === rowData.id ? "#D4F2F3" : "#FFF",
              }),
            }}
          />
        </Modal>
      </Grid>
    </Grid>
  )
}


export default (props) => {

  const { appointment } = props;
  const history = useHistory()
  const { addErrorToast } = useToasts()
  const [encounter, setEncounter] = useState<{}>();
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id



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
    <Grid
      className='h-full flex-wrap items-center justify-center'
      style={{
        backgroundColor: '#F4F5F7',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        alignContent: 'center',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {appointment !== undefined && encounter !== undefined ? <PatientRecord patient={appointment.patient} encounter={encounter} id={id} appointment={appointment}/> : <div style={{ width: '300px' }} className='flex items-center justify-center pr-15 py-64'>
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
    </Grid>
  )

}
