import React from 'react'

const REACT_APP_KEYCLOAK_ADDRESS = process.env.REACT_APP_KEYCLOAK_ADDRESS

export default function Home() {
  return (
    <div
      className='flex flex-col justify-center min-h-screen align-middle'
      style={{
        backgroundColor: '#27BEC2',
        backgroundImage: 'linear-gradient(140deg, #27BEC2 0%, #009688 75%)',
      }}
    >
      <img src='/img/logo.svg' alt='Boldo Logo' />
      <div className='mt-2 text-center'>
        <a className='text-white underline' href={`${REACT_APP_KEYCLOAK_ADDRESS}&redirect_uri=${window.location.href}`}>
          Login
        </a>
      </div>
    </div>
  )
}
