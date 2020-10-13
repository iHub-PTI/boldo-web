import React from 'react'

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
const KEYCLOAK_ADDRESS = process.env.KEYCLOAK_ADDRESS

export default function Home() {
    return (
        <div className='relative min-h-screen overflow-hidden bg-gray-50'>
        <div className='relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32'>
          <main className='max-w-screen-xl px-4 mx-auto mt-10 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28'>
            <div className='text-center'>
              <h2 className='text-4xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl'>
                Boldo&nbsp;
                <br className='xl:hidden' />
                <span className='text-indigo-600'>Doctors App</span>
              </h2>
              <p className='max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
                This is a work-in-progress preview of Boldo for Doctors.
              </p>
              <div className='max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8'>
                <div className='mt-3 rounded-md shadow sm:mt-0 sm:ml-3'>
                  <a
                    href={`${KEYCLOAK_ADDRESS}/auth/realms/PTI-Health/protocol/openid-connect/auth?response_type=code&client_id=boldo-patient&redirect_uri=${SERVER_ADDRESS}/api/auth/code`}
                    className='flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-indigo-600 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-indigo-500 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo md:py-4 md:text-lg md:px-10'
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
}
