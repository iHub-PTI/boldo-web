import React, { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { Button, Grid, TextField, Typography } from '@material-ui/core'
import { useRouteMatch, useHistory } from 'react-router-dom'
import moment from 'moment'

import useStyles from './style'
import useWindowDimensions from '../../util/useWindowDimensions'
import ShowSoepHelper from '../../components/TooltipSoep'
import { useToasts } from '../../components/Toast'

const Soep = {
  Subjetive: 'Subjetivo',
  Objective: 'Objetivo',
  Evalutation: 'Evaluacion',
  Plan: 'Plan',
}

export default () => {
  const classes = useStyles()
  const { width: screenWidth } = useWindowDimensions()
  const history = useHistory()
  const { addErrorToast, addToast } = useToasts()
  const [mainReason, setMainReason] = useState('')
  const [soepText, setSoepText] = useState(['', '', '', ''])
  const [showHover, setShowHover] = useState('')
  const [soepSelected, setSoepSelected] = useState(Soep.Subjetive)
  const [recordSoepSelected, setRecordSoepSelected] = useState(0)
  const [diagnose, setDiagnose] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedMedication, setSelectedMedication] = useState([])
  const [isRecordSoepAvailable, setRecordSoepAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [partOfEncounterId, setPartOfEncounterId] = useState('')
  const [soepRecordDesc, setSoepRecordDesc] = useState('')
  const [encounterId, setEncounterId] = useState('')
  const [encounterHistory, setEncounterHistory] = useState([])
  const [disableMainReason, setDisableMainReason] = useState(false)
  let match = useRouteMatch('/appointments/:id/inperson')
  const id = match?.params.id

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`)
        const {
          diagnosis = '',
          instructions = '',
          prescriptions,
          mainReason = '',
          partOfEncounterId = '',
        } = res.data.encounter
        setDiagnose(diagnosis)
        setInstructions(instructions)
        setSelectedMedication(prescriptions)
        setEncounterId(res.data.encounter.id)
        setPartOfEncounterId(partOfEncounterId)
        mainReason !== undefined && setMainReason(mainReason)
        if (res.data.encounter.soep !== undefined) {
          const { subjective = '', objective = '', evaluation = '', plan = '' } = res.data.encounter.soep
          let copyStrings = [...soepText]
          copyStrings[0] = subjective
          copyStrings[1] = objective
          copyStrings[2] = evaluation
          copyStrings[3] = plan
          setSoepText(copyStrings)
        }
        // setInitialLoad(false)
      } catch (err) {
        console.log(err)
        setInitialLoad(false)
        //@ts-ignore
        // addErrorToast(err)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (encounterHistory.length > 0) {
      switch (recordSoepSelected) {
        case 0:
          showSoepDataDynamic(0)
          break
        case 1:
          showSoepDataDynamic(1)
          break
        case 2:
          showSoepDataDynamic(2)
          break

        default:
          break
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordSoepSelected, encounterHistory, soepSelected])

  const showSoepDataDynamic = counter => {
    switch (soepSelected) {
      case Soep.Subjetive:
        setSoepRecordDesc(encounterHistory[counter].soep.subjective)
        break

      case Soep.Objective:
        setSoepRecordDesc(encounterHistory[counter].soep.objective)
        break

      case Soep.Evalutation:
        setSoepRecordDesc(encounterHistory[counter].soep.evaluation)
        break

      case Soep.Plan:
        setSoepRecordDesc(encounterHistory[counter].soep.plan)
        break

      default:
        break
    }
  }

  useEffect(() => {
    if (encounterHistory.length > 0) {
      //disable mainReason and show first mainReason record

      setDisableMainReason(true)
      setMainReason(encounterHistory[0].mainReason)
    }
  }, [encounterHistory])

  useEffect(() => {
    if (encounterId !== '') {
      const load = async () => {
        try {
          //get related encounters records
          const res = await axios.get(`/profile/doctor/relatedEncounters/${encounterId}`)
          if (res.data.encounter !== undefined) {
            var count = Object.keys(res.data.encounter.items).length
            const tempArray = []
            for (var i = 0; i < count; i++) {
              const data = res.data.encounter.items[i]
              data.startTimeDate = moment(data.startTimeDate).format('DD/MM/YYYY')
              if (data.appointmentId !== id) tempArray.push(data)
            }

            if (tempArray.length > 0) {
              setEncounterHistory(tempArray)
              setRecordSoepAvailable(true)
            }
          }
          setInitialLoad(false)
        } catch (err) {
          console.log(err)
          setInitialLoad(false)
          //@ts-ignore
          addErrorToast(err)
          setInitialLoad(false)
        }
      }
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterId])

  const saveConsultation = async () => {
    try {
      let copyStrings = [...soepText]
      let encounter = {}
      if (partOfEncounterId !== '') {
        encounter = {
          encounterData: {
            diagnosis: diagnose,
            instructions: instructions,
            prescriptions: selectedMedication,
            mainReason: mainReason,
            partOfEncounterId: partOfEncounterId,
            status: 'in-progress',
            encounterClass: 'A',
            soep: {
              subjective: copyStrings[0],
              objective: copyStrings[1],
              evaluation: copyStrings[2],
              plan: copyStrings[3],
            },
          },
        }
      } else {
        encounter = {
          encounterData: {
            diagnosis: diagnose,
            instructions: instructions,
            prescriptions: selectedMedication,
            mainReason: mainReason,
            status: 'in-progress',
            encounterClass: 'A',
            soep: {
              subjective: copyStrings[0],
              objective: copyStrings[1],
              evaluation: copyStrings[2],
              plan: copyStrings[3],
            },
          },
        }
      }

      
      setIsLoading(true)
      const res = await axios.put(`/profile/doctor/appointments/${id}/encounter`, encounter)
      if (res.data === 'OK') {
        addToast({ type: 'success', title: 'Datos guardados correctamente', text: '' })
        history.replace(`/`)
      } else {
        addErrorToast('Algo salió mal vuelva a intentarlo más tarde')
      }

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      addErrorToast(error)
    }
  }

  const onChangeFilter = useCallback(event => {
    setMainReason(event.target.value)
  }, [])

  const onChangeSoepText = useCallback(
    event => {
      let copyStrings = [...soepText]
      switch (soepSelected) {
        case Soep.Subjetive:
          copyStrings[0] = event.target.value
          break

        case Soep.Objective:
          copyStrings[1] = event.target.value
          break

        case Soep.Evalutation:
          copyStrings[2] = event.target.value
          break

        case Soep.Plan:
          copyStrings[3] = event.target.value
          break

        default:
          break
      }
      setSoepText(copyStrings)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [soepSelected]
  )

  const showSoepHeadersRecords = () => {
    const tempArray = []
    if (encounterHistory.length > 0) {
      //only show the last three record
      const encounterCounter = encounterHistory.length > 3 ? 3 : encounterHistory.length

      for (var i = 0; i < encounterCounter; i++) {
        const { startTimeDate } = encounterHistory[i]

        switch (i) {
          case 0:
            tempArray.push(
              <button
                style={{
                  height: '35px',
                  maxWidth: '130px',
                  fontSize: '12px',
                  backgroundColor: recordSoepSelected === 0 ? '#4299E1' : '#EDF2F7',
                  color: recordSoepSelected === 0 ? 'white' : 'black',
                }}
                className='rounded-full px-1 inline-flex items-center w-full text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
                onClick={() => setRecordSoepSelected(0)}
              >
                <svg
                  style={{ marginRight: '5px' }}
                  width='21'
                  height='20'
                  viewBox='0 0 21 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect x='0.25' width='20' height='20' rx='10' fill='white' />
                  <path
                    d='M11.5036 6.72727V14H9.96591V8.18679H9.9233L8.25781 9.23082V7.86719L10.0582 6.72727H11.5036Z'
                    fill='#4299E1'
                  />
                </svg>
                {startTimeDate}
              </button>
            )
            break

          case 1:
            tempArray.push(
              <button
                style={{
                  height: '35px',
                  maxWidth: '130px',
                  fontSize: '12px',
                  backgroundColor: recordSoepSelected === 1 ? '#4299E1' : '#EDF2F7',
                  color: recordSoepSelected === 1 ? 'white' : 'black',
                }}
                className='rounded-full px-1 inline-flex items-center w-full text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
                onClick={() => setRecordSoepSelected(1)}
              >
                <svg
                  style={{ marginRight: '5px' }}
                  width='21'
                  height='20'
                  viewBox='0 0 21 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect x='0.25' width='20' height='20' rx='10' fill='white' />
                  <path
                    d='M7.33949 14V12.892L9.92827 10.495C10.1484 10.282 10.3331 10.0902 10.4822 9.91974C10.6338 9.74929 10.7486 9.58239 10.8267 9.41903C10.9048 9.25331 10.9439 9.07457 10.9439 8.88281C10.9439 8.66974 10.8954 8.48627 10.7983 8.33239C10.7012 8.17614 10.5687 8.05658 10.4006 7.97372C10.2325 7.88849 10.0419 7.84588 9.82884 7.84588C9.6063 7.84588 9.41217 7.89086 9.24645 7.98082C9.08073 8.07079 8.95289 8.19981 8.86293 8.3679C8.77296 8.53598 8.72798 8.73603 8.72798 8.96804H7.26847C7.26847 8.49219 7.37618 8.07907 7.59162 7.72869C7.80705 7.37831 8.1089 7.10724 8.49716 6.91548C8.88542 6.72372 9.33286 6.62784 9.83949 6.62784C10.3603 6.62784 10.8137 6.72017 11.1996 6.90483C11.5878 7.08712 11.8897 7.34044 12.1051 7.66477C12.3205 7.98911 12.4283 8.3608 12.4283 8.77983C12.4283 9.05445 12.3738 9.32552 12.2649 9.59304C12.1584 9.86056 11.9678 10.1577 11.6932 10.4844C11.4186 10.8087 11.0315 11.1982 10.532 11.6527L9.47017 12.6932V12.7429H12.5241V14H7.33949Z'
                    fill='#6B7280'
                  />
                </svg>
                {startTimeDate}
              </button>
            )
            break

          case 2:
            tempArray.push(
              <button
                style={{
                  height: '35px',
                  maxWidth: '130px',
                  fontSize: '12px',
                  backgroundColor: recordSoepSelected === 2 ? '#4299E1' : '#EDF2F7',
                  color: recordSoepSelected === 2 ? 'white' : 'black',
                }}
                className='rounded-full px-1 inline-flex items-center w-full text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
                onClick={() => setRecordSoepSelected(2)}
              >
                <svg
                  style={{ marginRight: '5px' }}
                  width='21'
                  height='20'
                  viewBox='0 0 21 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect x='0.25' width='20' height='20' rx='10' fill='white' />
                  <path
                    d='M10.0277 14.0994C9.4974 14.0994 9.02509 14.0083 8.6108 13.826C8.19886 13.6413 7.87334 13.388 7.63423 13.0661C7.39749 12.7417 7.27557 12.3677 7.26847 11.9439H8.81676C8.82623 12.1214 8.88423 12.2777 8.99077 12.4126C9.09967 12.5452 9.24408 12.6482 9.42401 12.7216C9.60393 12.795 9.80634 12.8317 10.0312 12.8317C10.2656 12.8317 10.4728 12.7902 10.6527 12.7074C10.8326 12.6245 10.9735 12.5097 11.0753 12.3629C11.1771 12.2161 11.228 12.0469 11.228 11.8551C11.228 11.661 11.1735 11.4893 11.0646 11.3402C10.9581 11.1887 10.8042 11.0703 10.603 10.9851C10.4041 10.8999 10.1674 10.8572 9.89276 10.8572H9.21449V9.72798H9.89276C10.1248 9.72798 10.3295 9.68774 10.5071 9.60724C10.687 9.52675 10.8267 9.41548 10.9261 9.27344C11.0256 9.12902 11.0753 8.96094 11.0753 8.76918C11.0753 8.58688 11.0315 8.42708 10.9439 8.28977C10.8587 8.15009 10.7379 8.04119 10.5817 7.96307C10.4278 7.88494 10.2479 7.84588 10.0419 7.84588C9.83357 7.84588 9.64299 7.88376 9.47017 7.95952C9.29735 8.03291 9.15885 8.13826 9.05469 8.27557C8.95052 8.41288 8.89489 8.57386 8.88778 8.75852H7.41406C7.42116 8.33949 7.54072 7.97017 7.77273 7.65057C8.00473 7.33097 8.31723 7.0812 8.71023 6.90128C9.10559 6.71899 9.55185 6.62784 10.049 6.62784C10.5509 6.62784 10.9901 6.71899 11.3665 6.90128C11.7429 7.08357 12.0353 7.32978 12.2436 7.63991C12.4543 7.94768 12.5585 8.29332 12.5561 8.67685C12.5585 9.08404 12.4318 9.42377 12.1761 9.69602C11.9228 9.96828 11.5926 10.1411 11.1854 10.2145V10.2713C11.7204 10.34 12.1276 10.5258 12.407 10.8288C12.6887 11.1295 12.8284 11.5059 12.826 11.9581C12.8284 12.3724 12.7088 12.7405 12.4673 13.0625C12.2282 13.3845 11.898 13.6378 11.4766 13.8224C11.0552 14.0071 10.5722 14.0994 10.0277 14.0994Z'
                    fill='#6B7280'
                  />
                </svg>
                {startTimeDate}
              </button>
            )
            break

          default:
            break
        }
      }
    }
    return tempArray
  }
  const soepWithRecord = (
    <div className='flex  mt-6'>
      <Grid xs={12} md={5}>
        <div className='flex'>{showSoepHeadersRecords()}</div>
        <TextField
          fullWidth
          multiline
          rows='20'
          // InputProps={{
          //   disablenderline: true,
          // }}
          style={{
            marginTop: '20px',
          }}
          variant='outlined'
          placeholder='Ingrese notas actualizadas'
          value={soepRecordDesc}
        />
      </Grid>

      <Grid xs={12} md={7} className='ml-6'>
        <Typography variant='h6' color='textPrimary'>
          Consulta Actual
        </Typography>
        <TextField
          multiline
          rows='20'
          InputProps={{
            disableUnderline: true,
          }}
          style={{
            marginTop: '20px',
          }}
          fullWidth
          variant='outlined'
          placeholder='Ingrese notas actualizadas'
          value={
            soepSelected === Soep.Subjetive
              ? soepText[0]
              : soepSelected === Soep.Objective
              ? soepText[1]
              : soepSelected === Soep.Evalutation
              ? soepText[2]
              : soepText[3]
          }
          onChange={onChangeSoepText}
        />
      </Grid>
    </div>
  )
  const soepSection = (
    <TextField
      multiline
      rows='20'
      InputProps={{
        disableUnderline: true,
      }}
      style={{
        marginTop: '20px',
      }}
      fullWidth
      variant='outlined'
      placeholder='Ingrese notas actualizadas'
      value={
        soepSelected === Soep.Subjetive
          ? soepText[0]
          : soepSelected === Soep.Objective
          ? soepText[1]
          : soepSelected === Soep.Evalutation
          ? soepText[2]
          : soepText[3]
      }
      onChange={onChangeSoepText}
    />
  )

  return (
    <Grid>
      <Grid style={{ marginTop: '25px' }}>
        <Typography variant='h5' color='textPrimary'>
          Notas médicas
        </Typography>
        <Typography variant='body2' color='textSecondary'>
          SOEP
        </Typography>
      </Grid>

      <Typography style={{ marginTop: '15px' }} variant='body2' color='textPrimary'>
        Motivo Principal de la visita
      </Typography>
      <TextField
        disabled={disableMainReason}
        style={{ minWidth: '90vh' }}
        classes={{
          root: screenWidth > 1600 ? classes.textFieldPadding : classes.textFieldPaddingSmall,
        }}
        placeholder='Ej. Dolor de Cabeza'
        variant='outlined'
        value={mainReason}
        onChange={onChangeFilter}
      />

      <Grid style={{ marginTop: '15px' }} container>
        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === Soep.Subjetive ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === Soep.Subjetive ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected(Soep.Subjetive)
          }}
          onMouseEnter={() => setShowHover(Soep.Subjetive)}
          onMouseLeave={() => setShowHover('')}
        >
          Subjetivo
          {showHover === Soep.Subjetive &&
            ShowSoepHelper({ title: Soep.Subjetive, isBlackColor: soepSelected === Soep.Subjetive ? false : true })}
        </button>
        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === Soep.Objective ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === Soep.Objective ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected(Soep.Objective)
          }}
          onMouseEnter={() => setShowHover(Soep.Objective)}
          onMouseLeave={() => setShowHover('')}
        >
          Objetivo
          {showHover === Soep.Objective &&
            ShowSoepHelper({ title: Soep.Objective, isBlackColor: soepSelected === Soep.Objective ? false : true })}
        </button>

        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === Soep.Evalutation ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === Soep.Evalutation ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected(Soep.Evalutation)
          }}
          onMouseEnter={() => setShowHover(Soep.Evalutation)}
          onMouseLeave={() => setShowHover('')}
        >
          Evaluación
          {showHover === Soep.Evalutation &&
            ShowSoepHelper({ title: Soep.Evalutation, isBlackColor: soepSelected === Soep.Evalutation ? false : true })}
        </button>

        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === Soep.Plan ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === Soep.Plan ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected(Soep.Plan)
          }}
          onMouseEnter={() => setShowHover(Soep.Plan)}
          onMouseLeave={() => setShowHover('')}
        >
          Plan
          {showHover === Soep.Plan &&
            ShowSoepHelper({ title: Soep.Plan, isBlackColor: soepSelected === Soep.Plan ? false : true })}
        </button>
      </Grid>

      {initialLoad ? (
        <div style={{ width: '300px' }} className='flex items-center justify-center w-full h-full py-64'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
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
        </div>
      ) : isRecordSoepAvailable ? (
        soepWithRecord
      ) : (
        soepSection
      )}

      <div className='flex flex-row-reverse mt-6'>
        <div className='ml-6'>
          <Button
            disabled={initialLoad}
            className={classes.muiButtonContained}
            type='submit'
            variant='contained'
            endIcon={
              isLoading ? (
                <svg
                  className='w-5 h-5 mr-3 ml-3 text-indigo-700 animate-spin'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='white' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='white'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
              ) : (
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M5 13L9 17L19 7'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )
            }
            onClick={saveConsultation}
          >
            Finalizar Consulta
          </Button>
        </div>

        <div>
          <Button className={classes.muiButtonOutlined} variant='outlined' onClick={() => history.replace(`/`)}>
            Minimizar
          </Button>
        </div>
      </div>
    </Grid>
  )
}