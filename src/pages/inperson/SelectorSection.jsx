import React, { useState } from 'react'
import { Card, CardContent, Grid } from '@material-ui/core'

export default ({ setShowPrescriptionMenu }) => {
  const [activeColor, setActiveColor] = useState('M')

  return (
    <Grid>
      <Card
        style={{
          backgroundColor: '#EDF2F7',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          height: '90vh',
        }}
      >
        <CardContent>
          <div className='flex h-screen'>
            <div className='m-auto'>
              <button
                style={{ backgroundColor: `${activeColor==='P'?'#667EEA':'grey'}` }}
                className='flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600'

                onClick={() => {
                  setShowPrescriptionMenu(true)
                  setActiveColor('P');
                }}
              >
                <svg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
              <button
                 style={{ backgroundColor: `${activeColor==='M'?'#667EEA':'grey'}` }}
                className='flex items-center justify-center w-12 h-12 mt-3 rounded-full focus:outline-none focus:bg-gray-600'
                onClick={() => {
                  setShowPrescriptionMenu(false)
                  setActiveColor('M');
                }}
              >
                <svg width='16' height='20' viewBox='0 0 16 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}
