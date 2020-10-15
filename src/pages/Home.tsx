import React, { useContext } from 'react'

import { loginURL } from '../utils/helpers'
import { UserContext } from '../App'

export default function Home() {
  const ctx = useContext(UserContext)
  const { type, id } = ctx || {}
  return (
    <div
      className='flex flex-col justify-center min-h-screen align-middle'
      style={{
        backgroundColor: '#27BEC2',
        backgroundImage: 'linear-gradient(140deg, #27BEC2 0%, #009688 75%)',
      }}
    >
      <img src='/img/logo.svg' alt='Boldo Logo' />
      <div className='mt-4 text-center text-white'>
        <a className='underline ' href={loginURL}>
          Logged in. (Login again?)
        </a>
        <span> | </span>
        <a className='underline ' href='/call'>
          Call
        </a>
        <span> | </span>
        <a className='underline ' href='/dashboard'>
          Dashboard
        </a>
        <br />
        <span>Type: {type}</span>
        <span> | </span>
        <span>ID: {id}</span>
      </div>
    </div>
  )
}
