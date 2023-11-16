import { Typography } from '@material-ui/core'
import React from 'react'
import StudyOrder from './studiesorder/StudyOrder'

export function StudiesMenuRemote({ appointment }) {
  return (
    <div className='flex flex-col bg-white shadow-xl relative overflow-hidden h-full w-full scrollbar'>
      <div className='flex flex-row items-center pl-8 bg-primary-500 text-white' style={{ minHeight: '70px' }}>
        <Typography variant='h6'>Orden de estudios</Typography>
      </div>
      <div id='study_orders' className='flex flex-col flex-1 overflow-y-auto '>
        <StudyOrder appointment={appointment} remoteMode={true} />
      </div>
    </div>
  )
}
