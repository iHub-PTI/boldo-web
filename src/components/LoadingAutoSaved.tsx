import React from 'react'
import DoneIcon from '@material-ui/icons/Done'
import { CircularProgress } from '@material-ui/core'

export const LoadingAutoSaved = ({ loading, success, error, messageError='Ha ocurrido un error.' }) => {
  return (
    <div className='mt-3'>
      {loading && (
        <div className='flex justify-items-center items-center mt-2 text-sm text-gray-600 sm:mt-0 sm:mr-2'>
          <CircularProgress color='inherit' size={'1rem'} style={{ marginRight: '0.5rem' }} />
          Guardando.
        </div>
      )}
      {loading === false && success && (
        <div className='flex justify-items-center items-center mt-2 text-sm text-gray-600 sm:mt-0 sm:mr-2'>
          <DoneIcon fontSize='small' style={{ marginRight: '0.5rem' }} />
          Guardado.
        </div>
      )}
      {error && !loading && <div className='mt-2 text-sm text-red-600 sm:mt-0 sm:mr-2'>{ messageError }</div>}
    </div>
  )
}
