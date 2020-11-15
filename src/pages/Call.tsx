import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { differenceInSeconds } from 'date-fns'
import { Transition } from '@headlessui/react'

import Camera from '../components/webRTC/Camera'
import Stream from '../components/webRTC/Stream'
import Layout from '../components/Layout'
import { SocketContext } from '../App'
import { useToasts } from '../components/Toast'

const Gate = () => {
  const history = useHistory()
  let match = useRouteMatch<{ id: string }>('/appointments/:id/call')
  const id = match?.params.id

  if (!id) {
    history.replace(`/`)
    return null
  }

  return <Call id={id} />
}

export default Gate

const Call = ({ id }: { id: string }) => {
  const history = useHistory()
  const container = useRef<HTMLDivElement>(null)
  const stream = useRef<any>(null) //HTMLVideoElement
  const [showCallMenu, setShowCallMenu] = useState(false)
  const [showSidebarMenu, setShowSidebarMenu] = useState(false)
  const mediaStream = useUserMedia()
  const socket = useContext(SocketContext)

  const hangUp = async () => {
    if (socket) {
      socket.emit('end call', id)
      history.push('/')
    }
  }

  return (
    <Layout>
      <div ref={container} className='flex w-full h-full lg:h-screen bg-cool-gray-50'>
        <div className='relative flex-1'>
          <Stream _ref={stream} roomID={id} className='w-full h-full' mediaStream={mediaStream} socket={socket} />

          <div
            className='absolute top-0 left-0 flex items-center justify-between w-full px-10 py-4 blur-10'
            style={{ backgroundColor: 'rgb(255 255 255 / 75%)' }}
          >
            <h3 className='text-lg font-medium leading-6 text-cool-gray-900'>Hans Georg Wilhelm</h3>
            <div className='flex items-center space-x-4'>
              <p className='mt-1 text-sm font-semibold leading-5 text-cool-gray-700'>
                <Timer />
              </p>
              <button
                className='p-2 rounded-full inline-box text-cool-gray-700 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
                aria-label='Fullscreen'
                onClick={() => {
                  const elem = container.current as any
                  if (!elem) return

                  if (document.fullscreenElement) return document.exitFullscreen()
                  else if ((document as any).webkitFullscreenElement)
                    return (document as any).webkitExitFullscreen() /* Safari */
                  if (elem.requestFullscreen) return elem.requestFullscreen()
                  else if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen() /* Safari */
                }}
              >
                <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7 9C7 9.55 6.55 10 6 10C5.45 10 5 9.55 5 9V6C5 5.45 5.45 5 6 5H9C9.55 5 10 5.45 10 6C10 6.55 9.55 7 9 7H7V9ZM5 15C5 14.45 5.45 14 6 14C6.55 14 7 14.45 7 15V17H9C9.55 17 10 17.45 10 18C10 18.55 9.55 19 9 19H6C5.45 19 5 18.55 5 18V15ZM17 17H15C14.45 17 14 17.45 14 18C14 18.55 14.45 19 15 19H18C18.55 19 19 18.55 19 18V15C19 14.45 18.55 14 18 14C17.45 14 17 14.45 17 15V17ZM15 7C14.45 7 14 6.55 14 6C14 5.45 14.45 5 15 5H18C18.55 5 19 5.45 19 6V9C19 9.55 18.55 10 18 10C17.45 10 17 9.55 17 9V7H15Z'
                  />
                </svg>
              </button>
              {(document as any).pictureInPictureEnabled && (
                <button
                  className='p-2 rounded-full inline-box text-cool-gray-700 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
                  aria-label='Picture in Picture'
                  onClick={() => {
                    const elem = stream.current?.current as any
                    if (!elem) return

                    if ((document as any).pictureInPictureEnabled && !elem.disablePictureInPicture) {
                      try {
                        if ((document as any).pictureInPictureElement) (document as any).exitPictureInPicture()
                        console.log(elem)
                        elem.requestPictureInPicture().catch((err: Error) => console.log(err))
                      } catch (err) {
                        console.error(err)
                      }
                    }
                  }}
                >
                  <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M23 19V4.98C23 3.88 22.1 3 21 3H3C1.9 3 1 3.88 1 4.98V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19ZM18 11H12C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17H18C18.55 17 19 16.55 19 16V12C19 11.45 18.55 11 18 11ZM4 19.02H20C20.55 19.02 21 18.57 21 18.02V5.97C21 5.42 20.55 4.97 20 4.97H4C3.45 4.97 3 5.42 3 5.97V18.02C3 18.57 3.45 19.02 4 19.02Z'
                    />
                  </svg>
                </button>
              )}
              <button
                className='p-2 text-white rounded-full inline-box bg-primary-500 hover:bg-primary-400 focus:outline-none focus:shadow-outline'
                onClick={() => setShowSidebarMenu(showSidebarMenu => !showSidebarMenu)}
              >
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
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='absolute bottom-0 left-0 flex items-end justify-between w-full px-10 py-8'>
            <div className='absolute'>
              <div className='aspect-h-16 aspect-w-9' style={{ maxWidth: '14rem', minWidth: '8rem', width: '15vw' }}>
                <Camera
                  className='object-cover rounded-lg'
                  mediaStream={mediaStream}
                  style={{ transform: 'rotateY(180deg)' }}
                />
              </div>
            </div>
            <div />
            <button
              onClick={hangUp}
              className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-red-600 rounded-full'
            >
              <svg
                style={{ transform: 'rotate(134deg)' }}
                height='30px'
                width='30px'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
            </button>
            <div className='space-y-4'>
              {showCallMenu && (
                <>
                  <button
                    className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-gray-600 rounded-full'
                    onClick={() => {}}
                  >
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M14.999 11.5C14.999 13.16 13.659 14.5 11.999 14.5C10.339 14.5 8.99904 13.16 8.99904 11.5V5.5C8.99904 3.84 10.339 2.5 11.999 2.5C13.659 2.5 14.999 3.84 14.999 5.5V11.5ZM16.929 12.35C17.009 11.86 17.419 11.5 17.909 11.5C18.519 11.5 19.009 12.04 18.909 12.64C18.419 15.64 16.019 17.99 12.999 18.42V20.5C12.999 21.05 12.549 21.5 11.999 21.5C11.449 21.5 10.999 21.05 10.999 20.5V18.42C7.97901 17.99 5.57901 15.64 5.08901 12.64C4.99901 12.04 5.47901 11.5 6.08901 11.5C6.57901 11.5 6.98901 11.86 7.06901 12.35C7.47901 14.7 9.52901 16.5 11.999 16.5C14.469 16.5 16.519 14.7 16.929 12.35Z'
                      />
                    </svg>
                  </button>
                  <button
                    className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-gray-600 rounded-full'
                    onClick={() => {}}
                  >
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L19.29 15.79C19.92 16.42 21 15.97 21 15.08V8.91C21 8.02 19.92 7.57 19.29 8.2L17 10.5Z' />
                    </svg>
                  </button>
                </>
              )}
              <button
                className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-gray-600 rounded-full'
                onClick={() => {
                  setShowCallMenu(menuOpen => !menuOpen)
                }}
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-150 ease-in-out ${
                    showCallMenu && 'transform rotate-90'
                  }`}
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <SidebarContainer show={showSidebarMenu} hideSidebar={() => setShowSidebarMenu(false)} />
      </div>
    </Layout>
  )
}

const useUserMedia = () => {
  const { addErrorToast } = useToasts()
  const [mediaStream, setMediaStream] = useState<MediaStream>()

  useEffect(() => {
    let mounted = true

    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: 1280, height: 640 },
        })
        if (mounted) setMediaStream(stream)
      } catch (err) {
        console.log(err)
        addErrorToast(`Could not access Microhpone and Camera. Reason: ${err}`)
      }
    }

    if (!mediaStream) enableStream()
    return () => {
      mounted = false
      mediaStream?.getTracks().forEach(track => track.stop())
    }
  }, [addErrorToast, mediaStream])

  return mediaStream
}

const Timer = () => {
  const [start] = useState(new Date())
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = differenceInSeconds(Date.now(), start)
      setSeconds(seconds)
    }, 500)
    return () => clearInterval(interval)
  }, [start])

  const secondsToTime = (e: number) => {
    const h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0')

    return h + ':' + m + ':' + s
  }

  const time = useMemo(() => secondsToTime(seconds), [seconds])

  return <>{time}</>
}

interface SidebarContainerProps {
  show: boolean
  hideSidebar: () => void
}

const SidebarContainer = ({ show, hideSidebar }: SidebarContainerProps) => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!show) return
        hideSidebar()
      }
    }

    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
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
    <>
      <Transition show={show}>
        <div className='fixed inset-0 overflow-hidden 2xl:hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <section className='absolute inset-y-0 right-0 flex max-w-full pl-10 mt-16 sm:pl-16 lg:mt-0'>
              {/* Slide-over panel, show/hide based on slide-over state. */}
              <Transition.Child
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
                className='w-screen max-w-xl'
              >
                <div ref={container} className='h-full'>
                  <Sidebar hideSidebar={hideSidebar} />
                </div>
              </Transition.Child>
            </section>
          </div>
        </div>
      </Transition>

      <Transition
        show={show}
        enter='transform transition ease-in-out duration-500 sm:duration-700'
        enterFrom='translate-x-full'
        enterTo='translate-x-0'
        leave='transform transition ease-in-out duration-500 sm:duration-700'
        leaveFrom='translate-x-0'
        leaveTo='translate-x-full'
        className='hidden w-screen max-w-xl 2xl:block'
      >
        <Sidebar hideSidebar={hideSidebar} />
      </Transition>
    </>
  )
}

interface SidebarProps {
  hideSidebar: () => void
}

const Sidebar = ({ hideSidebar }: SidebarProps) => {
  return (
    <div className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
      <header className='px-4 py-6 sm:px-6'>
        <div className='flex items-start justify-between space-x-3'>
          <h2 className='text-lg font-medium leading-7 text-gray-900'>Profile</h2>
          <div className='flex items-center h-7'>
            <button
              aria-label='Close panel'
              onClick={() => hideSidebar()}
              className='text-gray-400 transition duration-150 ease-in-out hover:text-gray-500'
            >
              {/* Heroicon name: x */}
              <svg
                className='w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {/* Main */}
      <div className='divide-y divide-gray-200'>
        <div className='pb-6'>
          <div className='h-24 gradient-primary sm:h-20 lg:h-28' />
          <div className='flow-root px-4 -mt-12 space-y-6 sm:-mt-8 sm:flex sm:items-end sm:px-6 sm:space-x-6 lg:-mt-15'>
            <div>
              <div className='flex -m-1'>
                <div className='inline-flex overflow-hidden border-4 border-white rounded-lg'>
                  <img
                    className='flex-shrink-0 w-24 h-24 sm:h-40 sm:w-40 lg:w-48 lg:h-48'
                    src='https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80'
                    alt=''
                  />
                </div>
              </div>
            </div>
            <div className='space-y-5 sm:flex-1'>
              <div>
                <div className='flex items-center space-x-2.5'>
                  <h3 className='text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:leading-8'>Ashley Porter</h3>
                  <span aria-label='Online' className='flex-shrink-0 inline-block w-2 h-2 bg-green-400 rounded-full' />
                </div>
                <p className='text-sm leading-5 text-gray-500'>@ashleyporter</p>
              </div>
              <div className='flex flex-wrap'>
                <span className='inline-flex flex-shrink-0 w-full rounded-md shadow-sm sm:flex-1'>
                  <button
                    type='button'
                    className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700'
                  >
                    Message
                  </button>
                </span>
                <span className='inline-flex flex-1 w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3'>
                  <button
                    type='button'
                    className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50'
                  >
                    Call
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='px-4 py-5 sm:px-0 sm:py-0'>
          <dl className='space-y-8 sm:space-y-0'>
            <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
              <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Bio</dt>
              <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                <p>
                  Enim feugiat ut ipsum, neque ut. Tristique mi id elementum praesent. Gravida in tempus feugiat netus
                  enim aliquet a, quam scelerisque. Dictumst in convallis nec in bibendum aenean arcu.
                </p>
              </dd>
            </div>
            <div className='sm:flex sm:space-x-6 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5'>
              <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Location</dt>
              <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>New York, NY, USA</dd>
            </div>
            <div className='sm:flex sm:space-x-6 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5'>
              <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Website</dt>
              <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>ashleyporter.com</dd>
            </div>
            <div className='sm:flex sm:space-x-6 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5'>
              <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Birthday</dt>
              <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                <time dateTime='1982-06-23'>June 23, 1982</time>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
