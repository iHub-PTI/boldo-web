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
  const [soepSelected, setSoepSelected] = useState('Subjetivo')
  const [buttonColor, setButtonColor] = useState({ bgColor: '#F9FAFB', color: 'black' })
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
          style={{
            height: '35',
            backgroundColor: soepSelected === 'Subjetivo' ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === 'Subjetivo' ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected('Subjetivo')
          }}
          onMouseEnter={() => setShowHover('Subjetivo')}
          onMouseLeave={() => setShowHover('')}
        >
          Subjetivo
          {showHover === 'Subjetivo' &&
            ShowSoepHelper({ title: 'Subjetivo', isBlackColor: soepSelected === 'Subjetivo' ? false : true })}
        </button>
        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === 'Objetivo' ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === 'Objetivo' ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected('Objetivo')
          }}
          onMouseEnter={() => setShowHover('Objetivo')}
          onMouseLeave={() => setShowHover('')}
        >
          Objetivo
          {showHover === 'Objetivo' &&
            ShowSoepHelper({ title: 'Objetivo', isBlackColor: soepSelected === 'Objetivo' ? false : true })}
        </button>

        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === 'Evaluacion' ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === 'Evaluacion' ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected('Evaluacion')
          }}
          onMouseEnter={() => setShowHover('Evaluacion')}
          onMouseLeave={() => setShowHover('')}
        >
          Evaluación
          {showHover === 'Evaluacion' &&
            ShowSoepHelper({ title: 'Evaluacion', isBlackColor: soepSelected === 'Evaluacion' ? false : true })}
        </button>
        <button
          style={{
            height: '35',
            backgroundColor: soepSelected === 'Plan' ? '#27BEC2' : '#F9FAFB',
            color: soepSelected === 'Plan' ? 'white' : 'black',
          }}
          type='button'
          className='inline-flex items-center px-4 py-2 ml-3 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
          onClick={e => {
            setSoepSelected('Plan')
          }}
          onMouseEnter={() => setShowHover('Plan')}
          // onMouseLeave={() => setShowHover('')}
        >
          Plan
          {showHover === 'Plan' &&
            ShowSoepHelper({ title: 'Evaluacion', isBlackColor: soepSelected === 'Plan' ? false : true })}
         
        </button>
      </Grid>
    </Grid>
  )
}
