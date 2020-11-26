import React, { useEffect, useState, useRef, useContext } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'

import { UserContext, RoomsContext } from '../App'
import { avatarPlaceholder } from '../util/helpers'
import { differenceInYears } from 'date-fns'

const SERVER_URL = process.env.REACT_APP_SERVER_ADDRESS

type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

interface Props {
  isLoading?: boolean
}

const Layout: React.FC<Props> = ({ children, isLoading }) => {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [waitingroomOpen, setWaitingroomOpen] = useState(false)

  const { rooms } = useContext(RoomsContext)
  const { user } = useContext(UserContext)
  const { givenName, familyName, gender, photoUrl, license } = user || {}

  useEffect(() => {
    setMobileOpen(false)
    main.current?.scrollTo(0, 0)
  }, [pathname, main])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (!mobileOpen) return

      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    document.addEventListener('keyup', handleEscape)
    return () => document.removeEventListener('keyup', handleEscape)
  }, [mobileOpen])

  return (
    <div className='flex h-screen overflow-hidden bg-white'>
      {/* Off-canvas menu for mobile, show/hide based on off-canvas menu state. */}
      <Transition show={mobileOpen} className='lg:hidden'>
        <div className='fixed inset-0 z-40 flex'>
          {/* Off-canvas menu overlay, show/hide based on off-canvas menu state. */}
          <Transition.Child
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            className='fixed inset-0'
          >
            <div className='absolute inset-0 bg-gray-600 opacity-75' onClick={() => setMobileOpen(false)} />
          </Transition.Child>
          {/* Off-canvas menu, show/hide based on off-canvas menu state. */}
          <Transition.Child
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
            className='relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white'
          >
            <div className='absolute top-0 right-0 p-1 -mr-14'>
              <button
                className='flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600'
                aria-label='Close sidebar'
                onClick={() => setMobileOpen(false)}
              >
                <svg className='w-6 h-6 text-white' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='flex items-center flex-shrink-0 px-4'>
              <img className='w-auto h-8' src='/img/logo.svg' alt='Boldo' />
            </div>
            <div className='flex-1 h-0 mt-5 overflow-y-auto'>
              <nav className='px-2'>
                <div className='space-y-1'>
                  <NavLink
                    exact
                    activeClassName='text-gray-900 bg-gray-200 hover:bg-gray-200'
                    to={`/`}
                    className='flex items-center p-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50'
                  >
                    <svg
                      className='w-6 h-6 mr-3 text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    Calendario
                  </NavLink>
                  <NavLink
                    exact
                    activeClassName='text-gray-900 bg-gray-200 hover:bg-gray-200'
                    to={`/settings`}
                    className='flex items-center p-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50'
                  >
                    <svg
                      className='w-6 h-6 mr-3 text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-600'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    Mi cuenta
                  </NavLink>
                </div>
              </nav>
            </div>
          </Transition.Child>
          <div className='flex-shrink-0 w-14'>{/* Dummy element to force sidebar to shrink to fit close icon */}</div>
        </div>
      </Transition>

      <WaitingRoomSidebar show={waitingroomOpen} hideSidebar={() => setWaitingroomOpen(false)} />

      {/* Static sidebar for desktop */}
      <div className='hidden lg:flex lg:flex-shrink-0'>
        <div className='flex flex-col w-64 pt-5 pb-4 bg-white border-r border-gray-200'>
          <div className='flex items-center flex-shrink-0 px-6'>
            <img className='w-auto h-8' src='/img/logo.svg' alt='Boldo' />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex flex-col flex-1 h-0 overflow-y-auto'>
            {/* User account dropdown */}
            <div className='relative inline-block px-3 mt-6 text-left'>
              {/* Dropdown menu toggle, controlling the show/hide state of dropdown menu. */}
              <Menu>
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className='group w-full rounded-md px-3.5 py-2 text-sm leading-5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:bg-gray-200 focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150'>
                        <div className='flex items-center justify-between w-full'>
                          <div className='flex items-center justify-between min-w-0 space-x-3'>
                            <span className='relative inline-block'>
                              <span className='inline-block w-12 h-12 overflow-hidden bg-gray-100 rounded-full'>
                                <img
                                  src={photoUrl || avatarPlaceholder('doctor', gender)}
                                  alt='Avatar'
                                  className='object-cover w-full h-full max-w-none'
                                />
                              </span>

                              <svg
                                className='absolute bottom-0 right-0 block w-5 h-5 text-primary-500'
                                viewBox='0 0 18 18'
                                fill='currentColor'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path d='M1.21019 11.9057C1.49696 12.1557 1.7327 12.4694 1.70974 12.6828C1.69624 12.8103 1.68879 12.9399 1.68879 13.0716C1.68879 15.0114 3.14757 16.5838 4.94685 16.5838C5.16909 16.5838 5.38593 16.5597 5.5957 16.514C5.94899 16.4372 6.36613 16.5859 6.61607 16.8766C7.21018 17.567 8.05729 18 8.99999 18C9.9957 18 10.8871 17.5181 11.4846 16.759C11.722 16.4574 12.124 16.332 12.4813 16.4443C12.7698 16.5349 13.0751 16.5838 13.3909 16.5838C15.1902 16.5838 16.649 15.0111 16.649 13.0716C16.649 12.8546 16.6301 12.6425 16.5943 12.4368C16.5338 12.0898 16.6949 11.6575 16.9641 11.3866C17.6008 10.7465 18 9.83593 18 8.82297C18 7.7201 17.5278 6.73761 16.7898 6.0943C16.503 5.84435 16.2673 5.53063 16.2902 5.31715C16.3038 5.18971 16.3112 5.06012 16.3112 4.92839C16.3112 2.98854 14.8524 1.4162 13.0531 1.4162C12.8309 1.4162 12.614 1.44027 12.4043 1.48596C12.051 1.56278 11.6339 1.41409 11.3839 1.12341C10.7898 0.433006 9.94268 0 8.99999 0C8.05733 0 7.21021 0.433006 6.61607 1.12341C6.36613 1.41372 5.94899 1.56278 5.5957 1.48596C5.38596 1.44027 5.16909 1.4162 4.94685 1.4162C3.1476 1.4162 1.68879 2.98891 1.68879 4.92839C1.68879 5.11533 1.70264 5.29871 1.72931 5.47754C1.77388 5.77848 1.57223 6.14951 1.27906 6.39135C0.502236 7.03255 0 8.04052 0 9.17703C0 10.2799 0.472178 11.2624 1.21019 11.9057Z' />
                                <path
                                  d='M4.66396 9.33865C4.73623 9.20443 4.92068 9.20269 5.08955 9.35638L6.78918 10.6122C6.88137 10.671 6.96954 10.7011 7.05431 10.7011C7.22961 10.7011 7.36842 10.5687 7.5025 10.4411L12.9415 4.73419C13.2816 4.3465 13.6122 4.20985 13.8281 4.35854C13.9277 4.42722 13.9922 4.53059 14.0095 4.64992C14.0301 4.79154 13.9828 4.94412 13.8764 5.07938L7.33667 13.4067C7.24176 13.5274 7.12085 13.594 6.99656 13.594C6.84895 13.594 6.71522 13.5008 6.62907 13.3387L4.70956 9.71138C4.63019 9.57583 4.6126 9.43499 4.66396 9.33865Z'
                                  fill='white'
                                />
                              </svg>
                            </span>

                            <div className='flex-1 min-w-0'>
                              <h2 className='text-sm font-medium leading-5 text-gray-900 truncate'>
                                {`${givenName} ${familyName}`}
                              </h2>
                              <p className='text-sm leading-5 text-left text-gray-500 truncate'>{license}</p>
                            </div>
                          </div>
                          {/* Heroicon name: chevron-down */}
                          <svg
                            className='flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </div>
                      </Menu.Button>
                    </div>
                    {/* Dropdown panel, show/hide based on dropdown state. */}
                    <Transition
                      show={open}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                      className='absolute left-0 right-0 z-10 mx-3 mt-1 origin-top rounded-md shadow-lg'
                    >
                      <div
                        className='bg-white rounded-md shadow-xs'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='options-menu'
                      >
                        <div className='py-1'>
                          <a
                            href='https://play.google.com/store'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                            role='menuitem'
                          >
                            Get patient app
                          </a>
                          <a
                            href='mailto:soporte@pti.org.py'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                            role='menuitem'
                          >
                            Support
                          </a>
                        </div>
                        <div className='border-t border-gray-100' />
                        <div className='py-1'>
                          <a
                            className='block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                            role='menuitem'
                            href={`${SERVER_URL}/logout?redirect_url=${window.location.origin}`}
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
            <div className='w-full px-3 mt-5'>
              <span className='relative inline-flex w-full rounded-md shadow-sm'>
                <button
                  type='button'
                  className='inline-flex items-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
                  onClick={() => setWaitingroomOpen(true)}
                >
                  <svg
                    className='w-6 h-6 mr-3 text-gray-400'
                    viewBox='0 0 24 25'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M6 5.5H18C19.1 5.5 20 6.4 20 7.5V9.65C18.84 10.07 18 11.17 18 12.47V14.5H6V12.47C6 11.16 5.16 10.06 4 9.65V7.5C4 6.4 4.9 5.5 6 5.5ZM19 12.5C19 11.4 19.9 10.5 21 10.5C22.1 10.5 23 11.4 23 12.5V17.5C23 18.6 22.1 19.5 21 19.5H3C1.9 19.5 1 18.6 1 17.5V12.5C1 11.4 1.9 10.5 3 10.5C4.1 10.5 5 11.4 5 12.5V15.5H19V12.5Z'
                    />
                  </svg>
                  Sala de espera
                </button>

                {!!rooms.length && (
                  <span className='absolute top-0 right-0 flex w-3 h-3 -mt-1 -mr-1'>
                    <span className='absolute inline-flex w-full h-full bg-pink-400 rounded-full opacity-75 animate-ping'></span>
                    <span className='relative inline-flex w-3 h-3 bg-pink-500 rounded-full'></span>
                  </span>
                )}
              </span>
            </div>
            {/* Navigation */}
            <nav className='px-3 mt-6'>
              <div className='space-y-1'>
                <NavLink
                  exact
                  activeClassName='text-gray-900 bg-gray-200 hover:bg-gray-200'
                  to={`/`}
                  className='flex items-center p-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50'
                >
                  <svg
                    className='w-6 h-6 mr-3 text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  Calendario
                </NavLink>
                <NavLink
                  exact
                  activeClassName='text-gray-900 bg-gray-200 hover:bg-gray-200'
                  to={`/settings`}
                  className='flex items-center p-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50'
                >
                  <svg
                    className='w-6 h-6 mr-3 text-gray-500 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-600'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  Mi cuenta
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Main column */}
      <div className='flex flex-col flex-1 w-0 overflow-hidden'>
        {/* Search header */}
        <div className='relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:hidden'>
          {/* Sidebar toggle, controls the 'sidebarOpen' sidebar state. */}
          <button
            className='px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:bg-gray-100 focus:text-gray-600 lg:hidden'
            aria-label='Open sidebar'
            onClick={() => setMobileOpen(value => !value)}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M4 6h16M4 12h8m-8 6h16' />
            </svg>
          </button>
          <div className='flex justify-end flex-1 px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center'>
              <div className='relative flex-grow-0 mr-3 inline-box'>
                <button
                  className='p-1 rounded-full inline-box text-cool-gray-400 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
                  aria-label='Waitingroom'
                  onClick={() => setWaitingroomOpen(true)}
                >
                  <svg className='w-6 h-6' viewBox='0 0 24 25' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M6 5.5H18C19.1 5.5 20 6.4 20 7.5V9.65C18.84 10.07 18 11.17 18 12.47V14.5H6V12.47C6 11.16 5.16 10.06 4 9.65V7.5C4 6.4 4.9 5.5 6 5.5ZM19 12.5C19 11.4 19.9 10.5 21 10.5C22.1 10.5 23 11.4 23 12.5V17.5C23 18.6 22.1 19.5 21 19.5H3C1.9 19.5 1 18.6 1 17.5V12.5C1 11.4 1.9 10.5 3 10.5C4.1 10.5 5 11.4 5 12.5V15.5H19V12.5Z'
                    />
                  </svg>
                </button>
                {!!!!rooms.length && (
                  <span className='absolute top-0 right-0 flex w-3 h-3 pointer-events-none'>
                    <span className='absolute inline-flex w-full h-full bg-pink-400 rounded-full opacity-75 animate-ping'></span>
                    <span className='relative inline-flex w-3 h-3 bg-pink-500 rounded-full'></span>
                  </span>
                )}
              </div>
              {/* Profile dropdown */}
              <div className='relative ml-3'>
                <Menu>
                  {({ open }) => (
                    <>
                      <div>
                        <span className='relative inline-block'>
                          <Menu.Button className='flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:shadow-outline'>
                            <span className='inline-block w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
                              <img
                                src={photoUrl || avatarPlaceholder('doctor', gender)}
                                alt='Avatar'
                                className='object-cover w-full h-full max-w-none'
                              />
                            </span>
                          </Menu.Button>
                          <svg
                            className='absolute bottom-0 right-0 block w-4 h-4 text-primary-500'
                            viewBox='0 0 18 18'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M1.21019 11.9057C1.49696 12.1557 1.7327 12.4694 1.70974 12.6828C1.69624 12.8103 1.68879 12.9399 1.68879 13.0716C1.68879 15.0114 3.14757 16.5838 4.94685 16.5838C5.16909 16.5838 5.38593 16.5597 5.5957 16.514C5.94899 16.4372 6.36613 16.5859 6.61607 16.8766C7.21018 17.567 8.05729 18 8.99999 18C9.9957 18 10.8871 17.5181 11.4846 16.759C11.722 16.4574 12.124 16.332 12.4813 16.4443C12.7698 16.5349 13.0751 16.5838 13.3909 16.5838C15.1902 16.5838 16.649 15.0111 16.649 13.0716C16.649 12.8546 16.6301 12.6425 16.5943 12.4368C16.5338 12.0898 16.6949 11.6575 16.9641 11.3866C17.6008 10.7465 18 9.83593 18 8.82297C18 7.7201 17.5278 6.73761 16.7898 6.0943C16.503 5.84435 16.2673 5.53063 16.2902 5.31715C16.3038 5.18971 16.3112 5.06012 16.3112 4.92839C16.3112 2.98854 14.8524 1.4162 13.0531 1.4162C12.8309 1.4162 12.614 1.44027 12.4043 1.48596C12.051 1.56278 11.6339 1.41409 11.3839 1.12341C10.7898 0.433006 9.94268 0 8.99999 0C8.05733 0 7.21021 0.433006 6.61607 1.12341C6.36613 1.41372 5.94899 1.56278 5.5957 1.48596C5.38596 1.44027 5.16909 1.4162 4.94685 1.4162C3.1476 1.4162 1.68879 2.98891 1.68879 4.92839C1.68879 5.11533 1.70264 5.29871 1.72931 5.47754C1.77388 5.77848 1.57223 6.14951 1.27906 6.39135C0.502236 7.03255 0 8.04052 0 9.17703C0 10.2799 0.472178 11.2624 1.21019 11.9057Z' />
                            <path
                              d='M4.66396 9.33865C4.73623 9.20443 4.92068 9.20269 5.08955 9.35638L6.78918 10.6122C6.88137 10.671 6.96954 10.7011 7.05431 10.7011C7.22961 10.7011 7.36842 10.5687 7.5025 10.4411L12.9415 4.73419C13.2816 4.3465 13.6122 4.20985 13.8281 4.35854C13.9277 4.42722 13.9922 4.53059 14.0095 4.64992C14.0301 4.79154 13.9828 4.94412 13.8764 5.07938L7.33667 13.4067C7.24176 13.5274 7.12085 13.594 6.99656 13.594C6.84895 13.594 6.71522 13.5008 6.62907 13.3387L4.70956 9.71138C4.63019 9.57583 4.6126 9.43499 4.66396 9.33865Z'
                              fill='white'
                            />
                          </svg>
                        </span>
                      </div>
                      {/* Profile dropdown panel, show/hide based on dropdown state. */}
                      <Transition
                        show={open}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                        className='absolute right-0 w-48 mt-2 origin-top-right rounded-md shadow-lg'
                      >
                        <div
                          className='bg-white rounded-md shadow-xs'
                          role='menu'
                          aria-orientation='vertical'
                          aria-labelledby='user-menu'
                        >
                          <div className='py-1'>
                            <a
                              href='https://play.google.com/store'
                              target='_blank'
                              rel='noopener noreferrer'
                              className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                              role='menuitem'
                            >
                              Get patient app
                            </a>
                            <a
                              href='mailto:soporte@pti.org.py'
                              target='_blank'
                              rel='noopener noreferrer'
                              className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                              role='menuitem'
                            >
                              Support
                            </a>
                          </div>
                          <div className='border-t border-gray-100' />
                          <div className='py-1'>
                            <a
                              className='block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                              role='menuitem'
                              href={`${SERVER_URL}/logout?redirect_url=${window.location.origin}`}
                            >
                              Logout
                            </a>
                          </div>
                        </div>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
          </div>
        </div>
        <main ref={main} className='relative z-0 flex-1 overflow-y-auto focus:outline-none' tabIndex={0}>
          {isLoading ? <div className='h-1 fakeload-15 bg-primary-500' /> : children}
        </main>
      </div>
    </div>
  )
}

export default Layout

interface WaitingRoomSidebarProps {
  show: boolean
  hideSidebar: () => void
}

const WaitingRoomSidebar: React.FC<WaitingRoomSidebarProps> = ({ show, hideSidebar }) => {
  const container = useRef<HTMLDivElement>(null)
  const { rooms, setAppointments, appointments } = useContext(RoomsContext)

  useEffect(() => {
    const load = async () => {
      const res = await axios.get<AppointmentWithPatient[]>('/profile/doctor/appointments/openAppointments')

      // Ping for data
      setAppointments?.(res.data)
    }
    load()
    if (setAppointments) {
      // FIXME: Would probably be better to not use setInterval here
      const timer = setInterval(() => {
        load()
      }, 60 * 1000)
      return () => clearInterval(timer)
    }
  }, [setAppointments])

  // Allow for outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!show) return
        hideSidebar()
      }
    }

    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
  }, [show, hideSidebar])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (!show) return
      if (event.key === 'Escape') hideSidebar()
    }

    document.addEventListener('keyup', handleEscape)
    return () => document.removeEventListener('keyup', handleEscape)
  }, [show, hideSidebar])

  return (
    <Transition show={show}>
      <div className='fixed inset-0 z-50 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <section className='absolute inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
            {/* Slide-over panel, show/hide based on slide-over state. */}
            <Transition.Child
              enter='transform transition ease-in-out duration-500 sm:duration-700'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-500 sm:duration-700'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'
              className='w-screen max-w-md'
            >
              <div ref={container} className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
                <div className='flex-1'>
                  {/* Header */}
                  <header className='px-4 py-6 bg-gray-50 sm:px-6'>
                    <div className='flex items-start justify-between space-x-3'>
                      <div className='space-y-1'>
                        <h2 className='text-lg font-medium leading-7 text-gray-900'>Sala de espera</h2>
                        <p className='text-sm leading-5 text-gray-500'>
                          En esta sección encontrarás los pacientes que se encuentren listos para iniciar la consulta
                          médica.
                        </p>
                      </div>
                      <div className='flex items-center h-7'>
                        <button
                          aria-label='Close panel'
                          className='text-gray-400 transition duration-150 ease-in-out hover:text-gray-500'
                          onClick={() => hideSidebar()}
                        >
                          {/* Heroicon name: x */}
                          <svg
                            className='w-6 h-6'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </header>
                  {/* Divider container */}
                  <div className='py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
                    {/* Project name */}
                    <ul className='px-4 space-y-1 sm:px-6 sm:py-5'>
                      {rooms.map(room => {
                        const appointment = appointments.find(appointment => appointment.id === room)

                        if (!appointment) {
                          console.log('Could not find appointment for room: ', room)
                          return null
                        }
                        const start = appointment.start
                          ? new Intl.DateTimeFormat('default', {
                              hour: 'numeric',
                              minute: 'numeric',
                            }).format(new Date(appointment.start))
                          : '00:00'

                        return (
                          <li key={room} className='col-span-1 bg-white rounded-lg shadow'>
                            <div className='flex items-center w-full p-6 space-x-6 justify-left'>
                              <img
                                className='flex-shrink-0 w-20 h-20 bg-gray-300 rounded-lg'
                                src={
                                  appointment.patient.photoUrl ||
                                  avatarPlaceholder('patient', appointment.patient.gender)
                                }
                                alt=''
                              />
                              <div className='flex-1 truncate'>
                                <div className='flex items-center justify-between space-x-3'>
                                  <h3 className='text-sm font-medium leading-5 text-gray-900 truncate'>
                                    {`${appointment.patient.givenName} ${appointment.patient.familyName}` || room}
                                  </h3>
                                  <span className='inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-gray-100 text-gray-800'>
                                    {start}
                                  </span>
                                </div>
                                <p className='mt-1 text-sm leading-5 text-gray-500 truncate'>
                                  {differenceInYears(Date.now(), new Date(appointment.patient.birthDate))} años{' | '}
                                  {appointment.patient.gender}
                                </p>
                              </div>
                            </div>
                            <div className='border-t border-gray-200'>
                              <div className='flex -mt-px'>
                                <div className='flex flex-1 w-0 -ml-px'>
                                  <Link
                                    to={`/appointments/${room}/call`}
                                    className='relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-transparent rounded-br-lg cursor-pointer hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10'
                                  >
                                    {/* Heroicon name: phone */}
                                    <svg className='w-5 h-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                                      <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                                    </svg>
                                    <span className='ml-3'>Join Call</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </section>
        </div>
      </div>
    </Transition>
  )
}
