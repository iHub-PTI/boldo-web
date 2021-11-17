import React, { useEffect, useState, useCallback } from 'react'
// import { useDispatch } from 'react-redux';
// import { merge } from 'remeda';
import { ReactComponent as Check } from '../assets/check.svg'
import { ReactComponent as Close } from '../assets/close.svg'
import { Card, Checkbox, Grid, Input, TextField, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import axios from 'axios'
import _debounce from 'lodash.debounce'
import { consoleSandbox } from '@sentry/utils'

// import {
//   mActualizarPosologia,
//   mEliminarPosologia,
// } from '../../../redux/actions';
// import { addMinutes } from 'date-fns';

const makePosologia = posologia =>
  `${posologia.dosis} cada ${posologia.cantidad} horas por ${posologia.frecuencia}  ${posologia.medidaFrecuencia}`

const posologiaInicial = {
  dosis: 1,
  cantidad: 1,
  frecuencia: 15,
  medidaFrecuencia: 'días',
}

export default props => {
  const { medicine } = props
  const { deleteMedicineCallback } = props
  const { changeDescriptionCallback } = props
  const { setDataCallback } = props
  console.log(props)
  const [posologia, _] = useState(posologiaInicial)

  const [searchValue, setSeachValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [medicationItems, setMedicationsItems] = useState([])
  const [medicationsLoading, setMedicationsLoading] = useState(true)
  const [selectedMedications, setSelectedMedications] = useState()
  const [showError, setShowError] = useState(false)

  // const debounce = useCallback(
  //   _debounce(_searchVal => {
  //     fetchData(_searchVal)
  //     // send the server request here
  //   }, 300),
  //   []
  // )

  // useEffect(() => {
  //   if (showEditModal) {
  //     fetchData('')
  //     setSelectedMedications(selectedMedicaitonsState)
  //   } else {
  //     setSeachValue('')
  //     setMedicationsItems([])
  //     setSelectedMedications([])
  //   }
  // }, [showEditModal])
  async function fetchData() {
    console.log(searchValue)
    try {
      setShowError(false)
      setMedicationsLoading(true)
      const res = await axios.get(`/medications${searchValue ? `?content=${searchValue}` : ''} `)
      setMedicationsItems(res.data.items)
      const medication = res.data.items[0]
      setSeachValue(medication.name.toLowerCase())
      setSelectedMedications({
        medicationId: medication.id,
        medicationName: medication.name,
        instructions: '',
        status: 'active',
        form: medication.form,
      })
      setMedicationsLoading(false)
    } catch (err) {
      console.log(err)
      setShowError(true)
    }
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setDataCallback(selectedMedications)
    handleCancel()
    // showEditModal = false
  }
  const handleCancel = async e => {
    setSelectedMedications()
    setSeachValue('')
    // showEditModal = false
  }
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(
  //   //   mActualizarPosologia(
  //   //     merge(value, { posologia: makePosologia(posologiaInicial) })
  //   //   )
  //   // );
  // }, []);

  // const onRemove = useCallback(() => {
  //   deleteMedicineCallback();
  //   // dispatch(mEliminarPosologia(value));
  // }, []);

  // const onChangeCampo = useCallback(
  //   (campo) => (event) => {
  //     const change = event.target.value;
  //     setPosologia((data) => {
  //       // const resultado = merge(data, { [campo]: change });
  //       // // dispatch(
  //       // //   mActualizarPosologia(
  //       // //     merge(value, { posologia: makePosologia(resultado) })
  //       // //   )
  //       // // );
  //       // return resultado;
  //     });
  //   },
  //   []
  // );

  // const onChangeIndicaciones = useCallback(
  //   (event) => {
  //     // dispatch(
  //     //   mActualizarPosologia({
  //     //     ...value,
  //     //     [event.target.name]: event.target.value,
  //     //   })
  //     // );
  //   },
  //   // [value, dispatch]
  // );

  // const GreenCheckbox = withStyles({
  //   root: {
  //     color: 'grey',
  //     '&$checked': {
  //       color: '#27BEC2',
  //     },
  //   },
  //   checked: {},
  //   disabled: {},
  // })(Checkbox)

  const handleChange = event => {
    console.log(event.target.checked)
    setChecked(event.target.checked)
  }

  useEffect(() => {
    console.log(searchValue)
    if (searchValue === '') {
      handleCancel()
    }
  }, [searchValue])
  const secondaryStyle = {
    color: '#767676',
    fontSize: 12,
    fontFamily: 'Montserrat',
    style: 'normal',
    marginTop: '10px',
    marginRight: '10px',
  }
  const prescriptionTextBox = {
    background: '#FFFFFF',
    border: '2px solid #D2D6DC',
    boxSizing: 'border-box',
    borderRadius: '8px',
    width: '40px',
    textAlign: 'center',
  }
  return (
    <Grid>
      <div className='col-span-6 mb-6 sm:col-span-3'>
        <label htmlFor='search' className='block text-sm font-medium leading-5 text-gray-700'>
          Agregar Medicamento:
        </label>
        {/* <input
          id='search'
          className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
          onChange={e => {
            setSeachValue(e.target.value)
            debounce(e.target.value)
          }}
          value={searchValue}
          type='text'
        /> */}

        <div class='flex border-2 mt-2 rounded'>
          <textarea
            id='search'
            type='text'
            class='px-4 py-2 w-80'
            value={searchValue}
            style={{ fontSize: '14px', resize: 'none' }}
            row={5}
            onChange={e => {
              setSeachValue(e.target.value)
            }}
            placeholder='nombre comercial, principio activo o laboratorio.'
          />
          <button
            style={{ backgroundColor: '#D4F2F3' }}
            onClick={e => fetchData()}
            class='flex items-center justify-center px-4 border-l'
          >
            <svg
              class='w-6 h-6 text-gray-600'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
            >
              <path d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z' />
            </svg>
          </button>
        </div>
      </div>

      {selectedMedications && (
        <>
          <Card
            style={{
              backgroundColor: '#F7FAFC',
              border: 'none',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
            }}
          >
            <Grid container justifyContent='center'>
              <Grid style={{ paddingLeft: '39px' }}>
                {' '}
                <TextField
                  required
                  InputProps={{
                    disableUnderline: true,
                  }}
                  value={posologia.dosis}
                  style={{ ...prescriptionTextBox }}
                  inputProps={{ style: { textAlign: 'center', cursor: 'none' } }}
                  // onChange={onChangeCampo('dosis')}
                />
              </Grid>
              <Typography
                noWrap
                style={{
                  ...secondaryStyle,

                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // width: '8rem',
                  marginLeft: '10px',
                  // marginTop:'10px',
                  fontSize: 15,
                  color: '#374151',
                  width: 100,
                }}
              >
                {medicationItems.length > 0 && medicationItems[0].form.toLowerCase()}
                {/* {medicine.medicationName.toLowerCase()} */}
              </Typography>
            </Grid>

            <Grid container justifyContent='center' style={{ marginTop: '10px' }}>
              <Typography
                noWrap
                style={{
                  ...secondaryStyle,

                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // width: '8rem',
                  marginRight: '10px',
                  // marginTop:'10px',
                  fontSize: 15,
                  color: '#374151',
                  // width: 100,
                }}
              >
                cada
              </Typography>
              <TextField
                required
                InputProps={{
                  disableUnderline: true,
                }}
                value={posologia.dosis}
                style={{ ...prescriptionTextBox }}
                inputProps={{ style: { textAlign: 'center', cursor: 'none' } }}
                // onChange={onChangeCampo('dosis')}
              />
              <Typography
                noWrap
                style={{
                  ...secondaryStyle,

                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // width: '8rem',
                  marginLeft: '10px',
                  // marginTop:'10px',
                  fontSize: 15,
                  width: 97,
                  color: '#374151',
                }}
              >
                hora(s)
              </Typography>
            </Grid>

            {checked === false && (
              <Grid container justifyContent='center' style={{ marginTop: '10px' }}>
                <Typography
                  noWrap
                  style={{
                    ...secondaryStyle,

                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // width: '8rem',
                    marginRight: '17px',
                    // marginTop:'10px',
                    fontSize: 15,
                    // width: 100,
                    color: '#374151',
                  }}
                >
                  por
                </Typography>
                <TextField
                  required
                  InputProps={{
                    disableUnderline: true,
                  }}
                  value={posologia.dosis}
                  style={{ ...prescriptionTextBox }}
                  inputProps={{ style: { textAlign: 'center', cursor: 'none' } }}
                  // onChange={onChangeCampo('dosis')}
                />
                <Typography
                  noWrap
                  style={{
                    ...secondaryStyle,

                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // width: '8rem',
                    marginLeft: '10px',
                    // marginTop:'10px',
                    fontSize: 15,
                    width: 97,
                    color: '#374151',
                  }}
                >
                  días
                </Typography>
              </Grid>
            )}

            <Grid container style={{ marginTop: '10px' }}>
              <Checkbox value={checked} onChange={handleChange} />
              <Typography
                noWrap
                style={{
                  color: '#374151',
                  marginTop: '8px',
                }}
              >
                consumo indefinido
              </Typography>
            </Grid>

            <Grid style={{ marginTop: '10px' }}>
              <Typography style={{ ...secondaryStyle, marginTop: '10px', fontSize: '16px', color: '#374151' }}>
                Indicaciones:
              </Typography>
            </Grid>
            <TextField
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              inputProps={{ style: { textAlign: 'center', cursor: 'none' } }}
              style={{
                ...prescriptionTextBox,
                width: '100%',
              }}
              // placeholder='Tomar con cada comida'
              required
              // value={medicine.instructions ? medicine.instructions : ''}
              onChange={e => changeDescriptionCallback(e.target.value)}
              name='indicaciones'
              // onChange={onChangeIndicaciones}
            />
          </Card>
          <Grid justifyContent='flex-end' spacing={2} container>
            <Grid item>
              <Close onClick={handleCancel} />
            </Grid>
            <Grid item>
              <Check onClick={handleSubmit} />
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  )
}
