import React from 'react'

const Error = () => {
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <div className='px-4 pt-5 pb-4 sm:my-8 sm:max-w-lg sm:p-6'>
        <div>
          <div className='flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full animate-pulse'>
            {/* Heroicon name: exclamation */}
            <svg
              className='w-10 h-10 text-red-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>

          <div className='mt-6 text-center sm:mt-5'>
            <h3 className='text-xl font-medium leading-6 text-gray-900' id='modal-headline'>
              Ha ocurrido un error
            </h3>
            <div className='mt-2'>
              <p className='text-lg text-gray-500'>
                Lo sentimos mucho, algo salió mal. Por favor, inténtelo de nuevo más tarde, o póngase en contacto con el
                soporte.
              </p>
            </div>
          </div>
        </div>
        <div className='flex justify-center w-full mt-6 sm:mt-8'>
          <a
            href='/'
            className='px-4 py-2 text-lg font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2'
          >
            Inténtar de nuevo
          </a>
        </div>
      </div>
    </div>
  )
}

export default Error
