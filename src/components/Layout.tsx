import React, { useEffect, useState, useRef } from 'react'
import { Transition } from '@headlessui/react'
import { useHistory } from 'react-router-dom'

const Layout: React.FC<{}> = props => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    main.current?.scrollTo(0, 0)
  }, [main])

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
        <Header openMobile={() => setMobileOpen(true)} />
        <main ref={main} className='relative z-0 flex-1 overflow-y-auto focus:outline-none' tabIndex={0}>
          {props.children}
        </main>
      </div>
    </div>
  )
}

export default Layout

const Sidebar = () => {
  return (
    <>
      <div className='flex items-center flex-shrink-0 px-6'>
        <img className='w-auto h-8' src='/Logo.svg' alt='Boldo' />
      </div>
      {/* Sidebar component */}
      <div className='flex flex-col flex-1 h-0 overflow-y-auto'>
        {/* Navigation */}
        <nav className='px-3 mt-6'>
          <div className='mt-8'>
            {/* Secondary navigation */}
            <h3
              className='px-3 text-xs font-semibold leading-4 tracking-wider text-gray-500 uppercase'
              id='teams-headline'
            >
              Dashboard
            </h3>
            <div className='mt-1 space-y-1' role='group' aria-labelledby='teams-headline'>
              <a
                href={'/dashboard'}
                className='flex items-center px-3 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out rounded-md group hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50'
              >
                <span className='w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full' />
                <span className='truncate'>WaitRooms</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

interface HeaderProps {
  openMobile: () => void
}

const Header: React.FC<HeaderProps> = props => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const history = useHistory()
  const { openMobile } = props

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
        <div className='flex justify-end flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8'>
          <div className='flex items-center ml-4 md:ml-6'>
            {/* <button
              className='p-1 rounded-full text-cool-gray-400 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
              aria-label='Notifications'
            >
              <svg className='w-6 h-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                />
              </svg>
            </button> */}
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
                  {/* <img
                    className='w-8 h-8 rounded-full'
                    src={`https://www.gravatar.com/avatar/${md5(props.user.email)}.jpg?d=mp`}
                    alt='Avatar'
                  /> */}

                  <p className='hidden ml-3 text-sm font-medium leading-5 text-cool-gray-700 lg:block'>Diego King</p>
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
                    <button
                      className='block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900'
                      role='menuitem'
                      onClick={async () => {
                        await fetch('/api/auth/logout')
                        history.push('/')
                      }}
                    >
                      Logout
                    </button>
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
