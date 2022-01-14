import React, { useState, useCallback, useEffect } from 'react'

import { Button, Card, CardContent, Grid, TextField, Typography, Checkbox } from '@material-ui/core'

import useStyles from './style'
import useWindowDimensions from '../../util/useWindowDimensions'
import ShowSoepHelper from '../../components/TooltipSoep'

export default () => {
  const classes = useStyles()

  const CardList = ({ medicamento }) => {
    const [checked, setChecked] = useState(false)

    const [checkedState, setCheckedState] = useState(new Array(medicamento.length).fill(false))

    const [selectedItem, setSelectedItem] = useState(JSON.parse(localStorage.getItem('selection')) || [])
    const [open, setOpen] = React.useState(false)

    const ConfirmMedicationList = selectedItem => {
      const cardsArray = []
      medicamento.forEach((element, index) => {
        selectedItem.forEach(item => {
          if (item.prescriptionId === element.id) {
            let medication = medicamento[index]
            cardsArray.push(
              <Card
                key={medication.id}
                // className="container-fluid"
                style={{
                  // width: '400px',
                  // marginRight: '40px',
                  marginBottom: '40px',
                }}
              >
                <CardContent>
                  <Grid>
                    <Grid medication container>
                      <Checkbox
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index, medication)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      <Grid>
                        <Typography noWrap variant='body2' color='textSecondary' style={{ width: '200px' }}>
                          {medication.forma}
                        </Typography>
                        <Typography noWrap variant='body2' color='textPrimary' style={{ width: '200px' }}>
                          {medication.medicamento}
                        </Typography>
                      </Grid>
                      {/* <Typography
                        style={{
                          marginRight: '0',
                          marginLeft: 'auto',
                          marginBottom: 'auto',
                          backgroundColor: '#48BB78',
                          color: 'white',
                          paddingRight: '10px',
                          paddingLeft: '10px',
                          borderRadius: '5px',
                        }}
                      >
                        -
                      </Typography> */}
                    </Grid>
                    <Grid container justify={'space-between'}>
                      <Typography
                        noWrap
                        style={{
                          marginLeft: '40px',
                          color: '#6B7280',
                          width: '350px',
                        }}
                      >
                        {medication.detalle}
                      </Typography>
                      <Typography style={{ color: '#A0AEC0' }}></Typography>
                    </Grid>
                    <Grid container justify={'space-between'}>
                      <Typography
                        noWrap
                        style={{
                          marginLeft: '40px',
                          color: '#6B7280',
                          width: '300px',
                        }}
                      >
                        {medication.fabricante.toLowerCase()}
                      </Typography>
                      <Typography style={{ color: '#A0AEC0' }}></Typography>
                    </Grid>
                    <Grid>
                      <Typography
                        style={{
                          marginLeft: '40px',
                          marginTop: '15px',
                          backgroundColor: '#9FA6B2',
                          color: 'white',
                          paddingRight: '10px',
                          paddingLeft: '10px',
                          borderRadius: '5px',
                          maxWidth: '100px',
                        }}
                      >
                        ID - {medication.numero}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )
          }
        })
      })

      return <div className='col-12 pr-0'>{cardsArray}</div>
    }

    useEffect(() => {
      const tempArray = new Array(medicamento.length).fill(false)
      medicamento.forEach((element, index) => {
        selectedItem.forEach(item => {
          if (item.prescriptionId === element.id) {
            tempArray[index] = true
          }
        })
      })
      setCheckedState(tempArray)
    }, [])

    const goBack = useCallback(event => {
      // dispatch(limpiarFormulario(limpiarFormulario))
    }, [])

    const onDispensar = useCallback(() => {
      // localStorage.removeItem('selection')
      // dispatch(
      //   procesarSeleccionDispensar(
      //     // Resource.Data(selectedItem)
      //     Resource.Query(selectedItem)
      //   )
      // )
    }, [selectedItem])

    const handleClickOpen = () => {
      setOpen(true)
      // setRowId(id);
      // setMedicamento(medicamento);
    }

    const handleClose = () => {
      setOpen(false)
    }

    const handleAllChange = event => {
      setChecked(event.target.checked)
      if (checked === true) {
        setCheckedState(Array(medicamento.length).fill(false))
        setSelectedItem([])
        localStorage.removeItem('selection')
      } else {
        setCheckedState(Array(medicamento.length).fill(true))
        setSelectedItem([])
        localStorage.removeItem('selection')
        let tempArr = []
        medicamento.map(item => {
          tempArr.push({
            prescriptionId: item.id,
            status: 'completed',
            wasSubstituted: false,
          })
        })
        setSelectedItem(tempArr)
        localStorage.setItem('selection', JSON.stringify(tempArr))
      }
    }

    const handleOnChange = (position, item) => {
      const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item))
      setCheckedState(updatedCheckedState)
      let medication = {
        prescriptionId: item.id,
        status: 'completed',
        wasSubstituted: false,
      }
      let exist = selectedItem.some(item => medication.prescriptionId === item.prescriptionId)

      if (exist) {
        localStorage.removeItem('selection')
        //delete
        let newArray = selectedItem.filter(item => medication.prescriptionId !== item.prescriptionId)
        setSelectedItem(newArray)
        localStorage.setItem('selection', JSON.stringify(newArray))
        setChecked(false)
      } else {
        //add
        let newArray = [
          ...selectedItem,
          {
            prescriptionId: item.id,
            status: 'completed',
            wasSubstituted: false,
          },
        ]
        setSelectedItem(selectedItem => newArray)
        localStorage.setItem('selection', JSON.stringify(newArray))
      }
    }

    if (medicamento !== undefined) {
      const cardsArray = medicamento.map((item, index) => (
        <Card
          key={item.id}
          // className="container-fluid"
          style={{
            // width: '400px',
            // marginRight: '40px',
            marginBottom: '40px',
          }}
        >
          <CardContent>
            <Grid>
              <Grid item container>
                <Checkbox
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index, item)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />

                <Grid>
                  <Typography noWrap style={{ width: '200px' }} variant='body2' color='textSecondary'>
                    {item.forma}
                  </Typography>
                  <Typography noWrap variant='body2' color='textPrimary' style={{ width: '200px' }}>
                    {item.medicamento}
                  </Typography>
                </Grid>
                {/* <Typography
                  style={{
                    marginRight: '0',
                    marginLeft: 'auto',
                    marginBottom: 'auto',

                    backgroundColor: '#48BB78',
                    color: 'white',
                    paddingRight: '10px',
                    paddingLeft: '10px',
                    borderRadius: '5px',
                  }}
                >
                  -
                </Typography> */}
              </Grid>
              <Grid container justify={'space-between'}>
                <Typography
                  noWrap
                  style={{
                    marginLeft: '40px',
                    color: '#6B7280',
                    width: '350px',
                  }}
                >
                  {item.detalle}
                </Typography>
                <Typography style={{ color: '#A0AEC0' }}></Typography>
              </Grid>
              <Grid container justify={'space-between'}>
                <Typography
                  noWrap
                  style={{
                    marginLeft: '40px',
                    color: '#6B7280',
                    width: '200px',
                  }}
                >
                  {item.fabricante.toLowerCase()}
                </Typography>
                <Typography style={{ color: '#A0AEC0' }}></Typography>
              </Grid>
              <Grid>
                <Typography
                  style={{
                    marginLeft: '40px',
                    marginTop: '15px',
                    backgroundColor: '#9FA6B2',
                    color: 'white',
                    paddingRight: '10px',
                    paddingLeft: '10px',
                    borderRadius: '5px',
                    maxWidth: '100px',
                  }}
                >
                  ID - {item.numero}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))

      return (
        <div className='row'>
          <div className='row col-12 pr-0'>
            {cardsArray.map((data, i) =>
              i % 2 ? (
                <div key={i} className='col-md-6 pr-0'>
                  {data}
                </div>
              ) : (
                <div key={i} className='col-md-6'>
                  {data}
                </div>
              )
            )}
          </div>

          <div className='row col-12 mt-10'>
            <div className='row col'>
              <Checkbox checked={checked} onChange={handleAllChange} inputProps={{ 'aria-label': 'controlled' }} />
              <Typography
                component={'span'}
                style={{
                  marginTop: '10px',
                  color: '#364152',
                }}
              >
                Seleccionar todos
              </Typography>
            </div>

            <div className='row ml-auto'>
              <div className='mr-3'>
                <Button className={classes.muiButtonOutlined} variant='outlined' onClick={goBack}>
                  Cancelar
                </Button>
              </div>
              <div>
                <Button
                  className={classes.muiButtonContained}
                  type='submit'
                  variant='contained'
                  // endIcon={<CheckIcon />}
                  onClick={handleClickOpen}
                >
                  Dispensar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <Typography component='span'>
        <Grid component='span'>Cargando ... </Grid>
      </Typography>
    )
  }

  const [mainReason, setmainReason] = useState('')

  const [medications, setMedications] = useState([])

  const onChangeFilter = useCallback(event => {
    setmainReason(event.target.value)
  }, [])

  // useEffect(() => {
  //   if (medicamentos.value !== undefined) {
  //     setMedications(medicamentos.value);
  //     const tempArray = medicamentos.value.filter(
  //       (item) =>
  //         item.numero
  //           .toLowerCase()
  //           .match(medicationFilter.toLowerCase(), 'g') ||
  //         item.medicamento
  //           .toLowerCase()
  //           .match(medicationFilter.toLowerCase(), 'g') ||
  //         item.detalle
  //           .toLowerCase()
  //           .match(medicationFilter.toLowerCase(), 'g') ||
  //         item.forma
  //           .toLowerCase()
  //           .match(medicationFilter.toLowerCase(), 'g')
  //     );
  //     setMedications(tempArray);
  //   } else {
  //     setMedications([]);
  //   }
  // }, [medicationFilter, medicamentos]);
  const { _, width: screenWidth } = useWindowDimensions()
  const [showHover, setShowHover] = useState('')
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
        style={{ minWidth: '90vh' }}
        classes={{
          root: screenWidth > 1600 ? classes.textFieldPadding : classes.textFieldPaddingSmall,
        }}
        placeholder='Sospecha de COVID-19'
        variant='outlined'
        value={mainReason}
        onChange={onChangeFilter}
        // required
      />

      <Grid style={{ marginTop: '15px' }} container>
        <button
          style={{ height: '35px' }}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            // e.stopPropagation()
            // dispatch({ type: 'reset' })
            // setError('')
            // setShowEditModal(true)
          }}
          onMouseEnter={() => setShowHover('Subjetivo')}
          onMouseLeave={() => setShowHover('')}
        >
          Subjetivo
          {/* <svg
                className='w-6 h-6 ml-3'
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.79279 7.29302C5.98031 7.10555 6.23462 7.00023 6.49979 7.00023C6.76495 7.00023 7.01926 7.10555 7.20679 7.29302L10.4998 10.586L13.7928 7.29302C13.885 7.19751 13.9954 7.12133 14.1174 7.06892C14.2394 7.01651 14.3706 6.98892 14.5034 6.98777C14.6362 6.98662 14.7678 7.01192 14.8907 7.0622C15.0136 7.11248 15.1253 7.18673 15.2192 7.28062C15.3131 7.37452 15.3873 7.48617 15.4376 7.60907C15.4879 7.73196 15.5132 7.86364 15.512 7.99642C15.5109 8.1292 15.4833 8.26042 15.4309 8.38242C15.3785 8.50443 15.3023 8.61477 15.2068 8.70702L11.2068 12.707C11.0193 12.8945 10.765 12.9998 10.4998 12.9998C10.2346 12.9998 9.98031 12.8945 9.79279 12.707L5.79279 8.70702C5.60532 8.51949 5.5 8.26518 5.5 8.00002C5.5 7.73486 5.60532 7.48055 5.79279 7.29302V7.29302Z'
                  fill='white'
                />
              </svg> */}
        </button>
        <button
          style={{ height: '35px', backgroundColor: '#F9FAFB', color: 'black' }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            // e.stopPropagation()
            // dispatch({ type: 'reset' })
            // setError('')
            // setShowEditModal(true)
          }}
          onMouseEnter={() => setShowHover('Objetivo')}
          onMouseLeave={() => setShowHover('')}
        >
          Objetivo
          {/* <svg
                className='w-6 h-6 ml-3'
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.79279 7.29302C5.98031 7.10555 6.23462 7.00023 6.49979 7.00023C6.76495 7.00023 7.01926 7.10555 7.20679 7.29302L10.4998 10.586L13.7928 7.29302C13.885 7.19751 13.9954 7.12133 14.1174 7.06892C14.2394 7.01651 14.3706 6.98892 14.5034 6.98777C14.6362 6.98662 14.7678 7.01192 14.8907 7.0622C15.0136 7.11248 15.1253 7.18673 15.2192 7.28062C15.3131 7.37452 15.3873 7.48617 15.4376 7.60907C15.4879 7.73196 15.5132 7.86364 15.512 7.99642C15.5109 8.1292 15.4833 8.26042 15.4309 8.38242C15.3785 8.50443 15.3023 8.61477 15.2068 8.70702L11.2068 12.707C11.0193 12.8945 10.765 12.9998 10.4998 12.9998C10.2346 12.9998 9.98031 12.8945 9.79279 12.707L5.79279 8.70702C5.60532 8.51949 5.5 8.26518 5.5 8.00002C5.5 7.73486 5.60532 7.48055 5.79279 7.29302V7.29302Z'
                  fill='white'
                />
              </svg> */}
               {showHover === 'Objetivo' && ShowSoepHelper({ title: 'Objetivo' ,isBlackColor:true})}
        </button>

        <button
          style={{ height: '35px' }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            // e.stopPropagation()
            // dispatch({ type: 'reset' })
            // setError('')
            // setShowEditModal(true)
          }}
          onMouseEnter={() => setShowHover('Evaluacion')}
          onMouseLeave={() => setShowHover('')}
        >
          Evaluación
          {/* <svg
                className='w-6 h-6 ml-3'
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.79279 7.29302C5.98031 7.10555 6.23462 7.00023 6.49979 7.00023C6.76495 7.00023 7.01926 7.10555 7.20679 7.29302L10.4998 10.586L13.7928 7.29302C13.885 7.19751 13.9954 7.12133 14.1174 7.06892C14.2394 7.01651 14.3706 6.98892 14.5034 6.98777C14.6362 6.98662 14.7678 7.01192 14.8907 7.0622C15.0136 7.11248 15.1253 7.18673 15.2192 7.28062C15.3131 7.37452 15.3873 7.48617 15.4376 7.60907C15.4879 7.73196 15.5132 7.86364 15.512 7.99642C15.5109 8.1292 15.4833 8.26042 15.4309 8.38242C15.3785 8.50443 15.3023 8.61477 15.2068 8.70702L11.2068 12.707C11.0193 12.8945 10.765 12.9998 10.4998 12.9998C10.2346 12.9998 9.98031 12.8945 9.79279 12.707L5.79279 8.70702C5.60532 8.51949 5.5 8.26518 5.5 8.00002C5.5 7.73486 5.60532 7.48055 5.79279 7.29302V7.29302Z'
                  fill='white'
                />
              </svg> */}
        </button>
        <button
          style={{ height: '35px' }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            // e.stopPropagation()
            // dispatch({ type: 'reset' })
            // setError('')
            // setShowEditModal(true)
          }}
          onMouseEnter={() => setShowHover('Plan')}
          // onMouseLeave={() => setShowHover('')}
        >
          Plan
          {/* <svg
                className='w-6 h-6 ml-3'
                width='21'
                height='20'
                viewBox='0 0 21 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M5.79279 7.29302C5.98031 7.10555 6.23462 7.00023 6.49979 7.00023C6.76495 7.00023 7.01926 7.10555 7.20679 7.29302L10.4998 10.586L13.7928 7.29302C13.885 7.19751 13.9954 7.12133 14.1174 7.06892C14.2394 7.01651 14.3706 6.98892 14.5034 6.98777C14.6362 6.98662 14.7678 7.01192 14.8907 7.0622C15.0136 7.11248 15.1253 7.18673 15.2192 7.28062C15.3131 7.37452 15.3873 7.48617 15.4376 7.60907C15.4879 7.73196 15.5132 7.86364 15.512 7.99642C15.5109 8.1292 15.4833 8.26042 15.4309 8.38242C15.3785 8.50443 15.3023 8.61477 15.2068 8.70702L11.2068 12.707C11.0193 12.8945 10.765 12.9998 10.4998 12.9998C10.2346 12.9998 9.98031 12.8945 9.79279 12.707L5.79279 8.70702C5.60532 8.51949 5.5 8.26518 5.5 8.00002C5.5 7.73486 5.60532 7.48055 5.79279 7.29302V7.29302Z'
                  fill='white'
                />
              </svg> */}
          {showHover === 'Plan' && ShowSoepHelper({ title: 'Plan' ,isBlackColor:false})}
        </button>
      </Grid>
    </Grid>
  )
}
