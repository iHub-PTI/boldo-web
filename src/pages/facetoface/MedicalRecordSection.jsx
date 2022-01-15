import React, { useState, useCallback } from 'react'

import {  Grid, TextField, Typography } from '@material-ui/core'

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
  const [showHover, setShowHover] = useState('')
  const [soepSelected, setSoepSelected] = useState(Soep.Subjetive)

  const onChangeFilter = useCallback(event => {
    setmainReason(event.target.value)
  }, [])


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
    </Grid>
  )
}
