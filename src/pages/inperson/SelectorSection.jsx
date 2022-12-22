import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Print from '../../components/icons/Print';
import { getReports } from '../../util/helpers';
import { useToasts } from '../../components/Toast';


export default ({ setDynamicMenuSelector, prescriptions, appointment }) => {
  const [ activeColor, setActiveColor ] = useState('M');
  const [ loading, setLoading ] = useState(false);
  const { addToast } = useToasts();
  const soep = {
    studies: 'Estudios',
    note: 'Notas médicas',
    prescription: 'Recetas',
  }
  const useTooltipStyles = makeStyles(() => ({
    tooltip: {
      margin: 5,
      
    },
  }));

  return (
    <Grid
      container
      item
      className='h-full flex-wrap items-center justify-center'
      style={{
        backgroundColor: '#EDF2F7',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        alignContent: 'center',
        border: 'none',
        boxShadow: 'none',
        display:'grid'
      }}
    >
      <Tooltip title={<h1 style={{ fontSize: 14 }}>{soep.note}</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
        <button
          style={{ backgroundColor: `${activeColor === 'M' ? '#667EEA' : 'grey'}`, height: '4rem', width: '4rem' }}
          className='flex items-center justify-center ml-1 mt-3 rounded-full focus:outline-none focus:bg-gray-600'
          onClick={() => {
            setDynamicMenuSelector('M')
            setActiveColor('M')
          }}
          // onMouseEnter={() => setShowHover(soep.note)}
          // onMouseLeave={() => setShowHover('')}
        >
            <svg width='1.5rem' height='1.5rem' viewBox='0 0 16 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M5.72461 1.60002C5.72461 1.28176 5.85104 0.97654 6.07608 0.751496C6.30113 0.526453 6.60635 0.400024 6.92461 0.400024H9.32461C9.64287 0.400024 9.94809 0.526453 10.1731 0.751496C10.3982 0.97654 10.5246 1.28176 10.5246 1.60002C10.5246 1.91828 10.3982 2.22351 10.1731 2.44855C9.94809 2.6736 9.64287 2.80002 9.32461 2.80002H6.92461C6.60635 2.80002 6.30113 2.6736 6.07608 2.44855C5.85104 2.22351 5.72461 1.91828 5.72461 1.60002Z'
                fill='white'
              />
              <path
                d='M3.3248 1.59998C2.68829 1.59998 2.07784 1.85283 1.62775 2.30292C1.17766 2.75301 0.924805 3.36346 0.924805 3.99998V17.2C0.924805 17.8365 1.17766 18.4469 1.62775 18.897C2.07784 19.3471 2.68829 19.6 3.3248 19.6H12.9248C13.5613 19.6 14.1718 19.3471 14.6219 18.897C15.0719 18.4469 15.3248 17.8365 15.3248 17.2V3.99998C15.3248 3.36346 15.0719 2.75301 14.6219 2.30292C14.1718 1.85283 13.5613 1.59998 12.9248 1.59998C12.9248 2.55475 12.5455 3.47043 11.8704 4.14556C11.1953 4.82069 10.2796 5.19998 9.32481 5.19998H6.9248C5.97003 5.19998 5.05435 4.82069 4.37922 4.14556C3.70409 3.47043 3.3248 2.55475 3.3248 1.59998V1.59998Z'
                fill='white'
              />
            </svg>          
        </button>
      </Tooltip>

      <Tooltip title={<h1 style={{ fontSize: 14 }}>{soep.prescription}</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
        <button
          style={{ backgroundColor: `${activeColor === 'P' ? '#667EEA' : 'grey'}`, height: '4rem', width: '4rem' }}
          className='flex items-center ml-1 mt-3 justify-center rounded-full focus:outline-none focus:bg-gray-600'
          onClick={() => {
            setDynamicMenuSelector('P')
            setActiveColor('P')
          }}
          // onMouseEnter={() => setShowHover(soep.prescription)}
          // onMouseLeave={() => setShowHover('')}
        >
          <svg width='1.5rem' height='1.5rem' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M10.3379 4.32755L4.32749 10.338C3.39805 11.2674 3.39805 12.7743 4.32749 13.7038C5.25694 14.6332 6.76387 14.6332 7.69332 13.7038L13.7037 7.69338C14.6332 6.76393 14.6332 5.257 13.7037 4.32755C12.7743 3.3981 11.2673 3.3981 10.3379 4.32755ZM3.0052 9.01567C1.34548 10.6754 1.34548 13.3663 3.0052 15.0261C4.66493 16.6858 7.35588 16.6858 9.01561 15.0261L15.026 9.01567C16.6857 7.35594 16.6857 4.66499 15.026 3.00526C13.3663 1.34553 10.6753 1.34553 9.01561 3.00526L3.0052 9.01567Z'
              fill='white'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M9.26328 14.7784L12.1586 11.8831L8.5524 8.27682L2.54199 14.2872L2.61026 14.3555L9.26328 14.7784Z'
              fill='white'
            />
          </svg>
        </button>
      </Tooltip>

      <Tooltip title={<h1 style={{ fontSize: 14 }}>{soep.studies}</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
        <button
          style={{ backgroundColor: `${activeColor === 'L' ? '#667EEA' : 'grey'}`, height: '4rem', width: '4rem' }}
          className='flex items-center justify-center ml-1 mt-3 rounded-full focus:outline-none focus:bg-gray-600'
          onClick={() => {
            setDynamicMenuSelector('L')
            setActiveColor('L')
          }}
          // onMouseEnter={() => setShowHover(soep.studies)}
          // onMouseLeave={() => setShowHover('')}
        >
          <svg width='1.5rem' height='1.5rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M7 2V4H8V18C8 19.0609 8.42143 20.0783 9.17157 20.8284C9.92172 21.5786 10.9391 22 12 22C13.0609 22 14.0783 21.5786 14.8284 20.8284C15.5786 20.0783 16 19.0609 16 18V4H17V2H7ZM11 16C10.4 16 10 15.6 10 15C10 14.4 10.4 14 11 14C11.6 14 12 14.4 12 15C12 15.6 11.6 16 11 16ZM13 12C12.4 12 12 11.6 12 11C12 10.4 12.4 10 13 10C13.6 10 14 10.4 14 11C14 11.6 13.6 12 13 12ZM14 7H10V4H14V7Z'
              fill='white'
            />
          </svg>
        </button>
      </Tooltip>
      
      {
        <Tooltip title={<h1 style={{ fontSize: 14 }}>Impresión de recetas</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
          <span>
            <button
              className='flex items-center justify-center mt-3 rounded-full focus:outline-none disabled:cursor-not-allowed'
              disabled = {loading}
              onClick={() => 
                {
                  if (prescriptions?.length > 0) {
                    addToast({ type: 'success', text: 'Descargando receta...' });
                    getReports(appointment, setLoading);
                  } else {
                    console.log("there is not prescriptions");
                    addToast({ type: 'info', title: 'Atención!', text: 'Debe agregar alguna receta para imprimirla.' });
                  }
                }
              }
            >
              <Print 
                bgColor={prescriptions?.length > 0 ? "#27BEC2" : "#F7F4F4"}
                iconColor={prescriptions?.length > 0 ? "#FFFFFF" : "#ABAFB6"}
                fromVirtual={false}
              />
            </button>
          </span>
        </Tooltip>
      }
    
    </Grid>
  )
}
