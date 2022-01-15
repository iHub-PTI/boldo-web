import React, { useState, useCallback } from 'react'

import { Button, Grid, TextField, Typography } from '@material-ui/core'

import useStyles from './style'
import useWindowDimensions from '../../util/useWindowDimensions'
import ShowSoepHelper from '../../components/TooltipSoep'

const  Soep =  {
  Subjetive: 'Subjetivo',
  Objective: 'Objetivo',
  Evalutation: 'Evaluacion',
  Plan:'Plan'
}

export default () => {
  const classes = useStyles()
  const { width: screenWidth } = useWindowDimensions()

  const [mainReason, setmainReason] = useState('')
  const [soepText, setSoepText] = useState(['', '', '', ''])
  const [showHover, setShowHover] = useState('')
  const [soepSelected, setSoepSelected] = useState(Soep.Subjetive)

  const onChangeFilter = useCallback(event => {
    setmainReason(event.target.value)
  }, [])

  const onChangeSoepText = useCallback(event => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soepSelected])
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

      <TextField
        // className="mt-5"
        multiline
        rows='20'
        InputProps={{
          disableUnderline: true,
        }}
        // classes={{
        //   root: screenWidth > 1600 ? classes.textFieldPadding : classes.textFieldPaddingSmall,
        // }}
        style={{
          marginTop: '20px',
        }}
        fullWidth
        variant='outlined'
        placeholder='Ingrese notas actualizadas'
        // required
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

      <div className='flex flex-row-reverse mt-6'>
        <div className='ml-6'>
          <Button
            className={classes.muiButtonContained}
            type='submit'
            variant='contained'
            endIcon={
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M5 13L9 17L19 7'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            }
            // onClick={handleClickOpen}
          >
            Finalizar Consulta
          </Button>
        </div>

        <div>
          <Button
            className={classes.muiButtonOutlined}
            variant='outlined'
            // onClick={goBack}
          >
            Minimizar
          </Button>
        </div>
      </div>
    </Grid>
  )
}
