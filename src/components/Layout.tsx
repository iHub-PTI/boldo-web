import React, { useEffect, useState, useRef, useContext } from 'react'
import { Transition } from '@headlessui/react'
import md5 from 'md5'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { UserContext } from '../App'
import { useSocket } from './hooks/sockets'

const SERVER_URL = process.env.REACT_APP_SERVER_ADDRESS
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_ADDRESS

interface Props {
  isLoading?: boolean
}

const Navbar: React.FC<Props> = ({ isLoading, children }) => {
  const { pathname } = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [waitingroomOpen, setWaitingroomOpen] = useState(false)
  const main = useRef<HTMLElement>(null)

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
    <>
      <div className='flex h-screen overflow-hidden bg-white'>
        {/* Off-canvas menu for mobile */}
        <div className='lg:hidden'>
          <Transition show={mobileOpen} className='absolute inset-0 z-40 flex'>
            {/* Off-canvas menu overlay, show/hide based on off-canvas menu state.*/}
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

            {/* Off-canvas menu, show/hide based on off-canvas menu state.*/}
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
                <Transition.Child
                  enter='transition-opacity duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='transition-opacity duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                  className='flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:bg-gray-600'
                  aria-label='Close sidebar'
                  as='button'
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className='w-6 h-6 text-white' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </Transition.Child>
              </div>
              <Sidebar />
            </Transition.Child>
            {/* Dummy element to force sidebar to shrink to fit close icon */}
            <div className='flex-shrink-0 w-14'></div>
          </Transition>
        </div>
        {/* Static sidebar for desktop */}
        <div className='hidden lg:flex lg:flex-shrink-0'>
          <div className='flex flex-col w-64 pt-5 pb-4 bg-gray-100 border-r border-gray-200'>
            <Sidebar />
          </div>
        </div>
        {/* Main column */}
        <div className='flex flex-col flex-1 w-0 overflow-hidden'>
          {/* Search header */}
          <Header openMobile={() => setMobileOpen(true)} openWaitingRoom={() => setWaitingroomOpen(true)} />
          <main ref={main} className='relative z-0 flex-1 overflow-y-auto focus:outline-none' tabIndex={0}>
            {isLoading ? <div className='h-1 fakeload-15 bg-primary-500' /> : children}

            <WaitingRoomSidebar show={waitingroomOpen} hideSidebar={() => setWaitingroomOpen(false)} />
          </main>
        </div>
      </div>
    </>
  )
}

export default Navbar

const Sidebar = () => {
  return (
    <>
      <div className='flex items-center flex-shrink-0 px-6'>
        <img className='w-auto h-8' src='/img/logo.svg' alt='Boldo Logo' />
      </div>
      {/* Sidebar component */}
      <div className='flex flex-col flex-1 h-0 overflow-y-auto'>
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
          </div>
        </nav>
      </div>
    </>
  )
}

interface HeaderProps {
  openMobile: () => void
  openWaitingRoom: () => void
}

const Header = (props: HeaderProps) => {
  const user = useContext(UserContext)
  const { email } = user || {}

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  const { openMobile, openWaitingRoom } = props

  // Allow for outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!dropdownOpen) return
        setDropdownOpen(false)
      }
    }

    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [dropdownOpen, container])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (!dropdownOpen) return

      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('keyup', handleEscape)
    return () => document.removeEventListener('keyup', handleEscape)
  }, [dropdownOpen])

  return (
    <>
      <div className='relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 '>
        <button
          className='px-4 border-r border-cool-gray-200 text-cool-gray-400 focus:outline-none focus:bg-cool-gray-100 focus:text-cool-gray-600 lg:hidden'
          aria-label='Open sidebar'
          onClick={() => openMobile()}
        >
          <svg
            className='w-6 h-6 transition duration-150 ease-in-out'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h8m-8 6h16' />
          </svg>
        </button>
        {/* Search bar */}
        <div className='flex justify-end flex-1 px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center ml-4 md:ml-6'>
            <button
              className='p-1 rounded-full text-cool-gray-400 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
              aria-label='Notifications'
              onClick={() => openWaitingRoom()}
            >
              <svg className='w-6 h-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                />
              </svg>
            </button>
            {/* Profile dropdown */}
            <div className='relative ml-3' ref={container}>
              <div>
                <button
                  className='flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:bg-cool-gray-100 lg:p-2 lg:rounded-md lg:hover:bg-cool-gray-100'
                  id='user-menu'
                  aria-label='User menu'
                  aria-haspopup='true'
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <img
                    className='w-8 h-8 rounded-full'
                    src={`https://www.gravatar.com/avatar/${md5(email || '')}.jpg?d=mp`}
                    alt='Avatar'
                  />
                  <p className='hidden ml-3 text-sm font-medium leading-5 text-cool-gray-700 lg:block'>{email}</p>
                  <svg
                    className='flex-shrink-0 hidden w-5 h-5 ml-1 text-cool-gray-400 lg:block'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
              <Transition
                show={dropdownOpen}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
                className='absolute right-0 w-48 mt-2 origin-top-right rounded-md shadow-lg'
              >
                <div
                  className='py-1 bg-white rounded-md shadow-xs'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu'
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className='py-1'>
                    <Link
                      to='/settings'
                      className='block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                      role='menuitem'
                    >
                      Mi cuenta
                    </Link>
                  </div>
                  <div className='border-t border-gray-100' />
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
                      href={`${SERVER_URL}/logout?redirect_url=${FRONTEND_URL}`}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface WaitingRoomSidebarProps {
  show: boolean
  hideSidebar: () => void
}

const WaitingRoomSidebar: React.FC<WaitingRoomSidebarProps> = ({ show, hideSidebar }) => {
  const [rooms, setRooms] = useState<string[]>([])

  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    let appointmentsData = [{ id: '1' }, { id: '2' }, { id: '3' }]

    socket.emit(
      'find patients',
      appointmentsData.map(e => e.id)
    )

    socket.on('patient ready', (appointmentId: string) => {
      setRooms(rooms => {
        if (rooms.find(e => e === appointmentId)) return rooms
        return [...(rooms || []), appointmentId]
      })
    })

    socket.on('peer not ready', (appointmentId: string) => {
      setRooms(rooms => rooms.filter(e => e !== appointmentId))
      socket.emit('find patients', [appointmentId])
    })
  }, [socket])

  return (
    <Transition show={show}>
      <div className='fixed inset-0 z-50 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <section className='absolute inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16' style={{ paddingTop: 64 }}>
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
              <div className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
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
                      {/* <ul className=''> */}
                      {rooms.map(e => {
                        return (
                          <li className='col-span-1 bg-white rounded-lg shadow'>
                            <div className='flex items-center justify-between w-full p-6 space-x-6'>
                              <div className='flex-1 truncate'>
                                <div className='flex items-center space-x-3'>
                                  <h3 className='text-sm font-medium leading-5 text-gray-900 truncate'>
                                    Room Number: {e}
                                  </h3>
                                </div>
                                {/* <p className='mt-1 text-sm leading-5 text-gray-500 truncate'>
                                  Pations count: {e.users.length}
                                </p> */}
                              </div>
                              <img
                                className='flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full'
                                src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
                                alt=''
                              />
                            </div>
                            <div className='border-t border-gray-200'>
                              <div className='flex -mt-px'>
                                <div className='flex flex-1 w-0 -ml-px'>
                                  <div
                                    onClick={() => {
                                      window.location.href = `/call?room=${e}`
                                    }}
                                    className='relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-transparent rounded-br-lg cursor-pointer hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10'
                                  >
                                    {/* Heroicon name: phone */}
                                    <svg className='w-5 h-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                                      <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                                    </svg>
                                    <span className='ml-3'>Join Call</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                      {/* </ul> */}
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
