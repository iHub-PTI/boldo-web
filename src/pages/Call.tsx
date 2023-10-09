import axios from 'axios'
import { differenceInMinutes, differenceInSeconds, differenceInYears, parseISO } from 'date-fns'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Layout from '../components/Layout'
import Stream, { CallState } from '../components/Stream'

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
  makeStyles,
  withStyles,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Tooltip from '@material-ui/core/Tooltip'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { SocketContext } from '../App'
import { ReactComponent as HelpIcon } from '../assets/help-icon.svg'
import { ReactComponent as PrivateCommentIconBadgesExtra } from '../assets/private-comments-badget-extra.svg'
import { ReactComponent as PrivateCommentIconBadge } from '../assets/private-comments-badget.svg'
import { ReactComponent as PrivateCommentIcon } from '../assets/private-comments.svg'
import { useToasts } from '../components/Toast'

import CancelAppointmentModal from '../components/CancelAppointmentModal'
import OrganizationBar from '../components/OrganizationBar'
import { PrescriptionMenu } from '../components/PrescriptionMenu'
import PrivateComments from '../components/PrivateComments'
import SidebarMenuCall from '../components/SidebarMenuCall'
import { StudiesMenuRemote } from '../components/StudiesMenuRemote'
import { CategoriesContext } from '../components/studiesorder/Provider'
import { AllOrganizationContext } from '../contexts/Organizations/organizationsContext'
import { ERROR_HEADERS } from '../util/Sentry/errorHeaders'
import handleSendSentry from '../util/Sentry/sentryHelper'
import { HEIGHT_NAVBAR, ORGANIZATION_BAR, WIDTH_XL } from '../util/constants'
import { getColorCode } from '../util/helpers'
import useWindowDimensions from '../util/useWindowDimensions'

import { ToggleMenu } from '../components/call/toggle-menu'


type Status = Boldo.Appointment['status']
type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization }
type CallStatus = { connecting: boolean }


const Gate = () => {
  const history = useHistory()
  const socket = useContext(SocketContext)
  const { addToast } = useToasts()
  console.log('')

  let match = useRouteMatch<{ id: string }>('/appointments/:id/call')
  const id = match?.params.id
  const { Organizations } = useContext(AllOrganizationContext)
  const [instance, setInstance] = useState(0)
  const [appointment, setAppointment] = useState<AppointmentWithPatient & { token: string }>()
  const [statusText, setStatusText] = useState('')
  const [callStatus, setCallStatus] = useState<CallStatus>({ connecting: false })
  const [sideBarAction, setSideBarAction] = useState(1)
  const token = appointment?.token || ''
  // this help us for identify the selected button
  const [selectedButton, setSelectedButton] = useState(1)
  // const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions()
  const { orders } = useContext(CategoriesContext)

  const updateStatus = useCallback(
    async (status?: Status) => {
      setInstance(0)
      if (!status) return

      const url = `/profile/doctor/appointments/${id}`
      try {
        if (['closed', 'open'].includes(status)) await axios.post(url, { status })
        setAppointment(appointment => {
          if (!appointment || !status) return
          return { ...appointment, status: status }
        })
      } catch (err) {
        const tags = {
          'endpoint': url,
          'method': 'POST'
        }
        handleSendSentry(err, ERROR_HEADERS.APPOINTMENT.FAILURE_STATUS_POST, tags)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudo actualizar el estado de la cita. !Inténtelo de nuevo más tarde¡'
        })
      }
    },
    [addToast, id]
  )

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const url = `/profile/doctor/appointments/${id}`
      try {
        const res = await axios.get<AppointmentWithPatient & { token: string }>(url)
        if (mounted) setAppointment(res.data)
      } catch (err) {
        console.log(err)
        if (mounted) {
          const tags = {
            'endpoint': url,
            'method': 'POST'
          }
          handleSendSentry(err, ERROR_HEADERS.APPOINTMENT.FAILURE_GET, tags)
          addToast({
            type: 'error',
            title: 'Ha ocurrido un error.',
            text: 'Falló la carga de la cita. ¡Inténtelo nuevamente más tarde!'
          })
          history.replace(`/`)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [addToast, history, id])

  useEffect(() => {
    if (appointment?.status !== 'upcoming') return
    let mounted = true

    const calculate = async () => {
      if (!mounted) return
      const minutes = differenceInMinutes(parseISO(appointment.start as any), Date.now())
      if (minutes < 15) {
        clearInterval(timer)
        const res = await axios.get<AppointmentWithPatient & { token: string }>(`/profile/doctor/appointments/${id}`)
        if (mounted) setAppointment(res.data)
      } else if (minutes < 16) {
        const seconds = differenceInSeconds(parseISO(appointment.start as any), Date.now())
        setStatusText(`La sala de espera se abre en ${seconds + 1 - 60 * 15} segundos`)
      } else if (minutes < 60) {
        setStatusText(`La sala de espera se abre en ${minutes - 14} minutos`)
      } else {
        setStatusText(`La sala de espera se abrirá 15 minutos antes del inicio de la cita.`)
      }
    }
    const timer = setInterval(() => calculate(), 1000)
    calculate()
    return () => {
      clearInterval(timer)
      mounted = false
    }
  }, [appointment, id])

  useEffect(() => {
    if (!socket) return
    if (appointment?.status !== 'open' || !token) return

    socket.emit('ready?', { room: id, token })
    socket.on('ready!', (roomId: string) => {
      console.log('READY!')
      if (roomId !== id) return
      setInstance(i => i + 1)
    })

    return () => {
      socket.off('ready!')
    }
  }, [appointment, id, socket, token])

  useEffect(() => {
    if (!socket) return
    if (appointment?.status !== 'open') return
    socket.on('end call', () => {
      addToast({ type: 'success', title: 'Llamada Finalizada', text: '¡El paciente ha terminado la llamada!' })
      updateStatus()
    })
    return () => {
      socket.off('end call')
    }
  }, [addToast, appointment, socket, updateStatus])

  const onCallStateChange = useCallback(
    (callState: CallState) => {
      switch (callState) {
        case 'connecting': {
          break
        }
        case 'connected': {
          setCallStatus({ connecting: false })
          break
        }
        case 'disconnected': {
          setCallStatus({ connecting: true })
          break
        }
        case 'closed': {
          setCallStatus({ connecting: false })
          setInstance(0)
          addToast({ type: 'warning', title: 'Conexión perdida', text: '¡Perdimos la conexión con el paciente!' })
          socket?.emit('ready?', { room: id, token })
          break
        }
      }
    },
    [addToast, token, id, socket]
  )

  if (!id) return null

  if (!appointment)
    return (
      <Layout>
        <div className='h-1 fakeload-15 bg-primary-500' />
      </Layout>
    )
  const controlSideBarState = () => {
    switch (sideBarAction) {
      // case 0:
      //   return <Sidebar appointment={appointment} />

      case 1:
        return <SOEP appointment={appointment} />

      case 2:
        return <PrescriptionMenu appointment={appointment} isFromInperson={false} />

      case 3:
        return <StudiesMenuRemote appointment={appointment} />

      default:
        return <SOEP appointment={appointment} />
    }
  }
  return (
    <Layout>
      <div style={{
        height: ` ${width >= WIDTH_XL
          ? `calc(100vh - ${ORGANIZATION_BAR}px)`
          : `calc(100vh - ${ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
          }`
      }}>
        <div className='h-6'>{Organizations && appointment && <OrganizationBar orgColor={getColorCode(Organizations, appointment.organization.id)} orgName={`${appointment.organization.name}`} />}</div>

        <SidebarMenuCall appointment={appointment}>
          {instance === 0 ? (
            <div className='flex h-full w-full flex-row flex-no-wrap' style={{ marginLeft: '88px' }}>
              <div className='flex h-full items-center w-8/12'>
                {/* daiting screen here */}
                <CallStatusMessage
                  status={appointment.status}
                  statusText={statusText}
                  updateStatus={updateStatus}
                  appointmentId={appointment.id}
                />
                {/* Togle Menu */}
                <div
                  style={{
                    position: 'fixed',
                    bottom: '0',
                    right: '34%',
                    marginBottom: '20px',
                    zIndex: 1
                  }}
                >
                  <ToggleMenu 
                    id={id}
                    appointment={appointment}
                    orders={orders}
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                    setSideBarAction={setSideBarAction}
                  />
                </div>
              </div>
              <Grid container item xs={4} style={{ display: 'grid' }}>
                {/* patient data screen */}
                <Card>{controlSideBarState()}</Card>
              </Grid>
            </div>
          ) : (
            <Call
              appointment={appointment}
              id={id}
              token={token}
              instance={instance}
              updateStatus={updateStatus}
              onCallStateChange={onCallStateChange}
              callStatus={callStatus}
            />
          )}
        </SidebarMenuCall>
      </div>
    </Layout>
  )
}

export default Gate

interface CallProps {
  id: string
  token: string
  instance: number
  updateStatus: (status?: Status) => Promise<void>
  appointment: AppointmentWithPatient
  onCallStateChange: (arg: CallState) => void
  callStatus: CallStatus
}

const Call = ({ id, token, instance, updateStatus, appointment, onCallStateChange, callStatus }: CallProps) => {
  const { addToast } = useToasts()
  const socket = useContext(SocketContext)
  const mediaStream = useUserMedia()

  const container = useRef<HTMLDivElement>(null)
  const stream = useRef<HTMLVideoElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  const [showSidebarMenu, setShowSidebarMenu] = useState(false)
  const [sideBarAction, setSideBarAction] = useState(1)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const { width } = useWindowDimensions()
  // this help us for identify the selected button
  const [selectedButton, setSelectedButton] = useState(1)
  //console.log(screenWidth)
  // const [loading, setLoading] = useState(false);
  const { orders } = useContext(CategoriesContext)

  const muteAudio = () => {
    if (!mediaStream) return
    setAudioEnabled(() => {
      const newState = !mediaStream.getAudioTracks()[0].enabled
      mediaStream.getAudioTracks()[0].enabled = newState
      return newState
    })

    console.log(mediaStream?.getAudioTracks()[0].enabled)
  }

  const muteVideo = () => {
    if (!mediaStream) return
    setVideoEnabled(() => {
      const newState = !mediaStream.getVideoTracks()[0].enabled
      mediaStream.getVideoTracks()[0].enabled = newState
      return newState
    })
  }
  // NOTE: Mutes audio for development comfort
  // useEffect(() => {
  //   if (mediaStream) {
  //     mediaStream.getAudioTracks()[0].enabled = false
  //     setAudioEnabled(false)
  //   }
  // }, [mediaStream])

  const hangUp = async () => {
    socket?.emit('end call', { room: id, token })
    updateStatus('closed')
    addToast({ type: 'success', title: 'Llamada Finalizada', text: '¡Has terminado la llamada!' })
  }

  if (mediaStream && video.current && !video.current?.srcObject) {
    video.current.srcObject = mediaStream
  }

  return (
    <div
      ref={container}
      className='flex w-full bg-cool-gray-50'
      style={{
        height: ` ${width >= WIDTH_XL
          ? `calc(100vh - ${ORGANIZATION_BAR}px)`
          : `calc(100vh - ${ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
          }`,
        marginLeft: '88px'
      }}
    >
      <div className='relative flex-1'>
        <Stream
          ref={stream}
          room={id}
          token={token}
          instance={instance}
          mediaStream={mediaStream}
          socket={socket}
          onCallStateChange={onCallStateChange}
        />

        <div
          className='absolute top-0 left-0 flex items-center justify-between w-full px-10 py-4 blur-10'
          style={{ backgroundColor: 'rgb(255 255 255 / 75%)' }}
        >
          <h3 className='text-lg font-medium leading-6 text-cool-gray-900'>
            {appointment.patient.givenName} {appointment.patient.familyName}
          </h3>
          <div className='flex items-center space-x-4'>
            <p className='mt-1 text-sm font-semibold leading-5 text-cool-gray-700'>
              <Timer />
            </p>
            <button
              className='p-2 rounded-full inline-box text-cool-gray-700 hover:bg-cool-gray-100 hover:text-cool-gray-500 focus:outline-none focus:shadow-outline focus:text-cool-gray-500'
              aria-label='Pantalla completa'
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
                aria-label='Imagen en imagen'
                onClick={() => {
                  if (!stream.current) return

                  if ((document as any).pictureInPictureEnabled && !(stream.current as any).disablePictureInPicture) {
                    try {
                      if ((document as any).pictureInPictureElement) {
                        ; (document as any).exitPictureInPicture()
                      }
                      ; (stream.current as any).requestPictureInPicture()?.catch((err: Error) => console.log(err))
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
            {/* <button
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
            </button> */}
          </div>
        </div>
        <div className='absolute bottom-0 left-0 flex items-end justify-between w-full px-10 py-8'>
          <div className='absolute'>
            <div className='aspect-h-9 aspect-w-16' style={{ maxWidth: '14rem', minWidth: '8rem', width: '12rem', height:'8rem'}}>
              <video
                ref={video}
                onCanPlay={e => (e.target as HTMLVideoElement).play()}
                autoPlay
                playsInline
                muted
                className='object-cover rounded-lg'
              />
            </div>
          </div>
          <div />

          <Grid justifyContent='center' container>
            <button
              className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-gray-600 rounded-full'
              onClick={muteAudio}
            >
              {audioEnabled ? (
                <svg
                  className='w-6 h-6'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5C8 2.79086 9.79086 1 12 1ZM13 19.9381V21H16V23H8V21H11V19.9381C7.05369 19.446 4 16.0796 4 12V10H6V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V10H20V12C20 16.0796 16.9463 19.446 13 19.9381ZM10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V5Z'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.00008 9.41421L1.29297 2.70711L2.70718 1.29289L22.7072 21.2929L21.293 22.7071L16.9057 18.3199C15.7992 19.18 14.4608 19.756 13.0001 19.9381V21H16.0001V23H8.00008V21H11.0001V19.9381C7.05376 19.446 4.00008 16.0796 4.00008 12V10H6.00008V12C6.00008 15.3137 8.68637 18 12.0001 18C13.2959 18 14.4958 17.5892 15.4766 16.8907L14.032 15.4462C13.4365 15.7981 12.7419 16 12.0001 16C9.79094 16 8.00008 14.2091 8.00008 12V9.41421ZM12.5181 13.9323C12.3529 13.9764 12.1792 14 12.0001 14C10.8955 14 10.0001 13.1046 10.0001 12V11.4142L12.5181 13.9323ZM14.0001 5V9.78579L16.0001 11.7858V5C16.0001 2.79086 14.2092 1 12.0001 1C10.1614 1 8.61246 2.24059 8.14468 3.93039L10.0001 5.78579V5C10.0001 3.89543 10.8955 3 12.0001 3C13.1046 3 14.0001 3.89543 14.0001 5ZM19.3585 15.1442L17.7908 13.5765C17.9273 13.0741 18.0001 12.5456 18.0001 12V10H20.0001V12C20.0001 13.1162 19.7715 14.1791 19.3585 15.1442Z'
                  />
                </svg>
              )}
            </button>
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
            <button
              className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-gray-600 rounded-full'
              onClick={muteVideo}
            >
              {videoEnabled ? (
                <svg
                  className='w-6 h-6'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3 5H15C16.1046 5 17 5.89543 17 7V8.38197L23 5.38197V18.618L17 15.618V17C17 18.1046 16.1046 19 15 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5ZM17 13.382L21 15.382V8.61803L17 10.618V13.382ZM3 7V17H15V7H3Z'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M1.70718 0.292892L0.292969 1.70711L3.58586 5H3.00008C1.89551 5 1.00008 5.89543 1.00008 7V17C1.00008 18.1046 1.89551 19 3.00008 19H15.0001C15.7022 19 16.3198 18.6382 16.6767 18.0908L22.293 23.7071L23.7072 22.2929L1.70718 0.292892ZM15.0001 16.4142L5.58586 7H3.00008V17H15.0001V16.4142ZM17.0001 8.38197L23.0001 5.38197V18.3701L21.0001 16.3701V8.61803L17.0001 10.618V13.0008L15.0001 11.0008V7H10.9993L8.99929 5H15.0001C16.1046 5 17.0001 5.89543 17.0001 7V8.38197Z'
                  />
                </svg>
              )}
            </button>

          </Grid>

          <Grid
            style={{
              position: 'fixed',
              bottom: '0',
              right: '34%',
              marginBottom: '20px',
              zIndex: 1
            }}
          >
            <Grid style={{ marginBottom: '20px' }}>
            <ToggleMenu 
              id={id}
              appointment={appointment}
              orders={orders}
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
              setSideBarAction={setSideBarAction}
            />
            </Grid>
          </Grid>

        </div>
        {callStatus.connecting && (
          <div
            className='absolute flex mb-20 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl top-1/2 left-1/2'
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <svg
              className='w-10 h-10 m-4 text-red-500 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </div>
        )}
      </div>
      <Grid container item xs={4} style={{ display: 'grid' }}>
        <SidebarContainer
          sideBarAction={sideBarAction}
          appointment={appointment}
          show={showSidebarMenu}
          stream={stream}
          hideSidebar={() => setShowSidebarMenu(false)}
        />
      </Grid>
    </div>
  )
}

const useUserMedia = () => {
  const { addErrorToast } = useToasts()
  const [mediaStream, setMediaStream] = useState<MediaStream>()

  useEffect(() => {
    let mounted = true

    // Handle errors which occur when trying to access the local media
    // hardware; that is, exceptions thrown by getUserMedia(). The two most
    // likely scenarios are that the user has no camera and/or microphone
    // or that they declined to share their equipment when prompted.

    const handleGetUserMediaError = (e: Error) => {
      console.log(e)
      switch (e.name) {
        case 'NotFoundError':
          addErrorToast('No se puede abrir la llamada porque no se encontró ninguna cámara y/o micrófono.')
          break
        case 'SecurityError':
          addErrorToast('Error de seguridad. Detalles: ' + e.message)
          break
        case 'PermissionDeniedError':
          addErrorToast('No se puede acceder al micrófono y a la cámara. Detalles: ' + e.message)
          break
        default:
          addErrorToast('Ha ocurrido un error al abrir la cámara y/o el micrófono: ' + e.message)
          break
      }

      //FIXME: Make sure we shut down our end of the RTCPeerConnection so we're ready to try again.
    }

    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        if (mounted) setMediaStream(stream)
      } catch (err) {
        handleGetUserMediaError(err)
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
  appointment: AppointmentWithPatient
  sideBarAction: Number
  stream: any
}

const SidebarContainer = ({ show, hideSidebar, appointment, sideBarAction, stream }: SidebarContainerProps) => {
  const container = useRef<HTMLDivElement>(null)

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
  const activatePicInPic = () => {
    console.log('activatePicInPic');
    if (!stream.current) return
    if ((document as any).pictureInPictureEnabled && !(stream.current as any).disablePictureInPicture) {
      try {
        if ((document as any).pictureInPictureElement) {
          ; (document as any).exitPictureInPicture()
        }
        ; (stream.current as any).requestPictureInPicture()?.catch((err: Error) => console.log(err))
      } catch (err) {
        console.error(err)
      }
    }
    //   }}
  }
  const controlSideBarState = () => {
    switch (sideBarAction) {
      // case 0:
      //   return <Sidebar appointment={appointment} />

      case 1:
        return <SOEP appointment={appointment} />

      case 2:
        return <PrescriptionMenu appointment={appointment} isFromInperson={false} />

      case 3:
        return <StudiesMenuRemote appointment={appointment} />

      default:
        return <SOEP appointment={appointment} />
    }
  }
  return (
    <Card>{controlSideBarState()}</Card>
    // <Sidebar appointment={appointment} hideSidebar={hideSidebar} />
    // <>
    //   <Transition show={show}>
    //     <div className='fixed inset-0 overflow-hidden 2xl:hidden'>
    //       <div className='absolute inset-0 overflow-hidden'>
    //         <section className='absolute inset-y-0 right-0 flex max-w-full pl-10 mt-16 sm:pl-16 lg:mt-0'>
    //           {/* Slide-over panel, show/hide based on slide-over state. */}
    //           <Transition.Child
    //             enter='transform transition ease-in-out duration-500 sm:duration-700'
    //             enterFrom='translate-x-full'
    //             enterTo='translate-x-0'
    //             leave='transform transition ease-in-out duration-500 sm:duration-700'
    //             leaveFrom='translate-x-0'
    //             leaveTo='translate-x-full'
    //             className='w-screen max-w-xl'
    //           >
    //             {/* <div ref={container} className='h-full'> */}
    //               <Sidebar appointment={appointment} hideSidebar={hideSidebar} />
    //             {/* </div> */}
    //           </Transition.Child>
    //         </section>
    //       </div>
    //     </div>
    //   </Transition>

    //   <Transition
    //     show={show}
    //     enter='transform transition ease-in-out duration-500 sm:duration-700'
    //     enterFrom='translate-x-full'
    //     enterTo='translate-x-0'
    //     leave='transform transition ease-in-out duration-500 sm:duration-700'
    //     leaveFrom='translate-x-0'
    //     leaveTo='translate-x-full'
    //     className='hidden w-screen max-w-xl 2xl:block'
    //   >
    //     <Sidebar appointment={appointment} hideSidebar={hideSidebar} />
    //   </Transition>
    // </>
  )
}

interface SidebarProps {
  hideSidebar?: () => void
  appointment: AppointmentWithPatient
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sidebar = ({ hideSidebar, appointment }: SidebarProps) => {
  // const [selectedTab, setSelectedTab] = useState(0)

  const birthDate = useMemo(() => {
    return new Intl.DateTimeFormat('default', {
      // weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(appointment.patient.birthDate.replaceAll('-', '/')))
  }, [appointment.patient.birthDate])

  const age = useMemo(() => {
    return differenceInYears(Date.now(), new Date(appointment.patient.birthDate))
  }, [appointment.patient.birthDate])

  return (
    // <div className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
    <PationProfile appointment={appointment} age={age} birthDate={birthDate} />
    // </div>
  )
}

function PationProfile({ appointment, age, birthDate }: { appointment: any; age: any; birthDate: any }) {
  const { width: screenWidth } = useWindowDimensions()
  return (
    <Grid style={{
      height: ` ${screenWidth >= WIDTH_XL ? `100vh` : `calc(100vh - ${HEIGHT_NAVBAR}px)`}`,
      overflowY: 'auto'
    }}>
      <CardHeader
        title='Paciente'
        titleTypographyProps={{ variant: 'h6' }}
        style={{
          backgroundColor: '#27BEC2', color: 'white',
        }}
      />

      <CardContent>
        <Grid style={{ paddingTop: '10px' }}>
          {appointment.patient.photoUrl !== undefined && (
            <div className='flex justify-center w-full  '>
              <img
                className='object-cover w-24 h-24 rounded-full'
                src={appointment.patient.photoUrl}
                alt='Foto de perfil del paciente'
              />
            </div>
          )}

          <Grid style={{ paddingTop: '10px' }}>
            <Typography variant='h6' color='textPrimary' align='center'>
              {appointment.patient.givenName} {appointment.patient.familyName}
            </Typography>

            <Typography variant='subtitle1' color='textSecondary' align='center'>
              {appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                ? 'Paciente sin cédula'
                : 'CI ' + appointment.patient.identifier}
            </Typography>
          </Grid>

          <Grid style={{ paddingTop: '20px' }}>
            <Typography variant='subtitle1' color='textSecondary'>
              Edad
            </Typography>
            <Typography variant='subtitle2' color='textPrimary'>
              {age} ({birthDate})
            </Typography>
          </Grid>

          <Grid style={{ paddingTop: '20px' }}>
            <Typography variant='subtitle1' color='textSecondary'>
              Profesión
            </Typography>
            <Typography variant='subtitle2' color='textPrimary'>
              {appointment.patient.job || '-'}
            </Typography>
          </Grid>

          <Grid style={{ paddingTop: '20px' }}>
            <Typography variant='subtitle1' color='textSecondary'>
              Teléfono
            </Typography>
            <Typography variant='subtitle2' color='textPrimary'>
              {appointment.patient.phone || '-'}
            </Typography>
          </Grid>

          <Grid style={{ paddingTop: '20px' }}>
            <Typography variant='subtitle1' color='textSecondary'>
              Ciudad
            </Typography>
            <Typography variant='subtitle2' color='textPrimary'>
              {appointment.patient.city || '-'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Grid>
  )
}
function TabPanel(props: { [x: string]: any; children: any; value: any; index: any }) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

/* 
  // It was decided to hide the implementation of the first and follow-up query. 
  // Because it's not very clear to the doctors 
  // TODO: Clear comments
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
} */

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  test: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  MuiAccordionroot: {
    '&.MuiAccordion-root:before': {
      backgroundColor: 'white',
    },
  },
  tab: {
    '& .MuiBox-root': {
      padding: '0px',
    },
  },
  tabHeight: {
    '& .MuiTab-root': {
      minHeight: '20px',
      minWidth: '50%',
      textTransform: 'none',
    },
  },
  input: {
    '&::placeholder': {
      fontWeight: 'bold'
    },
    paddingInline: '5px'
  }
}))

const soepPlaceholder = {
  'Subjetivo': 'Los datos referidos por el paciente son datos descriptivos, como los Antecedentes Remotos de la Enfermedad Actual (AREA) y los Antecedentes de la Enfermedad Actual (AEA).',
  'Objetivo': 'Son los datos que obtenemos con el examen físico, signos vitales, resultados laboratoriales, lista de medicación.',
  'Evaluacion': 'Impresión diagnóstica o presunción diagnóstica.',
  'Plan': 'Se dan las orientaciones a seguir, como control de signos de alarma, interconsulta con otra especialidad, cita para control o seguimiento del cuadro.'
}

function SOEP({ appointment }: { appointment: any }) {
  const [value] = useState(0)
  const [mainReason, setMainReason] = useState('')
  const [disableMainReason, setDisableMainReason] = useState(false)
  const [subjective, setSubjective] = useState('')
  const [objective, setObjective] = useState('')
  const [evaluation, setEvaluation] = useState('')
  const [plan, setPlan] = useState('')
  const [selectedMedication, setSelectedMedication] = useState<any[]>([])
  //const [soepHistory, setSoepHistory] = useState<any[]>([])
  const [diagnose, setDiagnose] = useState<string>('')
  const [instructions, setInstructions] = useState<string>('')
  const [initialLoad, setInitialLoad] = useState(true)
  //const [showEditModal, setShowEditModal] = useState(false)
  const [showPrivateCommentMenu, setShowPrivateCommentMenu] = useState(false)
  const [encounterId, setEncounterId] = useState('')
  const [partOfEncounterId, setPartOfEncounterId] = useState('')
  //const [encounterHistory, setEncounterHistory] = useState<any[]>([])
  //const [selectedRow, setSelectedRow] = useState()
  const [privateCommentsRecord, setPrivateCommentsRecords] = useState([])
  //const [isLoading, setIsLoading] = useState(false)
  const [showHover, setShowHover] = useState('')
  const [isAppointmentDisabled, setAppointmentDisabled] = useState(true)
  const [mainReasonRequired, setMainReasonRequired] = useState(false)
  // const { width } = useWindowDimensions()
  // const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
  //   setValue(newValue)
  // }
  const { addErrorToast, addToast } = useToasts()
  let match = useRouteMatch<{ id: string }>('/appointments/:id/call')
  const id = match?.params.id

  /* const tableIcons: Icons = {
    SortArrow: forwardRef((props, ref) => <ArrowUpward style={{ color: "#13A5A9" }} {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  } */

  useEffect(() => {

    if (appointment === undefined || appointment.status === 'locked' || appointment.status === 'upcoming') {
      setAppointmentDisabled(true)
      setDisableMainReason(true)
    } else {
      setAppointmentDisabled(false)
      setDisableMainReason(false)
    }
  }, [appointment])

  useEffect(() => {
    const load = async () => {
      const url = `/profile/doctor/appointments/${id}/encounter`
      try {
        const res = await axios.get(url)
        const { diagnosis, instructions, prescriptions, mainReason } = res.data.encounter
        setDiagnose(diagnosis)
        setInstructions(instructions)
        setSelectedMedication(prescriptions)
        setEncounterId(res.data.encounter.id)
        setPartOfEncounterId(res.data.encounter.partOfEncounterId)
        mainReason !== undefined && setMainReason(mainReason)
        if (res.data.encounter.soep !== undefined) {
          const { subjective, objective, evaluation, plan } = res.data.encounter.soep
          objective !== undefined && setObjective(objective)
          subjective !== undefined && setSubjective(subjective)
          evaluation !== undefined && setEvaluation(evaluation)
          plan !== undefined && setPlan(plan)
        }
        setInitialLoad(false)
      } catch (err) {
        const tags = {
          'endpoint': url,
          'method': 'GET',
          'appointment_id': id
        }
        handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_GET, tags)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudieron cargar las notas médicas. ¡Inténtelo nuevamente más tarde!'
        })
        setInitialLoad(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors 
    // TODO: Clear comments
    useEffect(() => {
    if (encounterId !== '' && showEditModal === false) {
      const load = async () => {
        try {
          //get related encounters records
          const res = await axios.get(`/profile/doctor/relatedEncounters/${encounterId}`)
          if (res.data.encounter !== undefined) {
            var count = Object.keys(res.data.encounter.items).length
            const tempArray = []
            for (var i = 0; i < count; i++) {
              const data = res.data.encounter.items[i]
              data.startTimeDate = moment(data.startTimeDate).format('DD/MM/YYYY')
              if (data.appointmentId !== appointment.id) tempArray.push(data)
            }
            setEncounterHistory(tempArray)
          }
        } catch (err) {
          console.log(err)
          setInitialLoad(false)
          //@ts-ignore
          addErrorToast(err)
        }
      }
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterId, showEditModal, appointment]) */

  useEffect(() => {
    if (initialLoad === false) {

      if (mainReason?.trim() === '') {
        setMainReasonRequired(true)
        return
      }
      else if (mainReason !== undefined && mainReason?.trim() !== '') {
        setMainReasonRequired(false)
        if (partOfEncounterId !== '') {
          debounce({
            encounterData: {
              diagnosis: diagnose,
              instructions: instructions,
              prescriptions: selectedMedication,
              mainReason: mainReason,
              encounterClass: 'V',
              partOfEncounterId: partOfEncounterId,
              soep: {
                subjective: subjective,
                objective: objective,
                evaluation: evaluation,
                plan: plan,
              },
            },
          })
        } else {
          debounce({
            encounterData: {
              diagnosis: diagnose,
              instructions: instructions,
              prescriptions: selectedMedication,
              mainReason: mainReason,
              encounterClass: 'V',
              soep: {
                subjective: subjective,
                objective: objective,
                evaluation: evaluation,
                plan: plan,
              },
            },
          })
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainReason, objective, subjective, evaluation, plan])

  useEffect(() => {
    if (mainReason === undefined || mainReason?.trim() === '') setMainReasonRequired(true)
    else {
      setMainReasonRequired(false)
    }
  }, [mainReason])

  /*
   // It was decided to hide the implementation of the first and follow-up query. 
  // It was decided to hide the implementation of the first and follow-up query. 
   // It was decided to hide the implementation of the first and follow-up query. 
   // Because it's not very clear to the doctors   
  // Because it's not very clear to the doctors   
   // Because it's not very clear to the doctors   
   // TODO: Clear comments
   useEffect(() => {
     if (showEditModal === true) {
       // get encounters list
       const load = async () => {
         try {
           const res = await axios.get(
             `/profile/doctor/relatedEncounters/Patient/${appointment.patient.identifier}/filterEncounterId/${encounterId}`
           )
           if (res.data.encounter !== undefined) {
             var count = Object.keys(res.data.encounter).length
             const tempArray = []
             for (var i = 0; i < count; i++) {
               const data = res.data.encounter[i][0]
               data.startTimeDate = moment(data.startTimeDate).format('DD/MM/YYYY')
               tempArray.push(data)
             }
             //console.log("a ver ", tempArray)
             setSoepHistory(tempArray)
           }
         } catch (error) {
           console.log(error)
           //@ts-ignore
           addErrorToast(error)
         }
       }
       load()
     }
 
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [showEditModal, appointment, encounterId]) */

  /* useEffect(() => {
    //send encounter selected to server
    if (selectedRow) {
      setIsLoading(true)
      //@ts-ignore
      setPartOfEncounterId(selectedRow.id)
      const send = async () => {
        const encounter = {
          encounterData: {
            diagnosis: diagnose,
            instructions: instructions,
            prescriptions: selectedMedication,
            mainReason: mainReason,
            //@ts-ignore
            partOfEncounterId: selectedRow.id,
            encounterClass: 'V',
            soep: {
              subjective: subjective,
              objective: objective,
              evaluation: evaluation,
              plan: plan,
            },
          },
        }
        try {
          const res = await axios.put(`/profile/doctor/appointments/${id}/encounter`, encounter)
          console.log('response', res.data)
          addToast({ type: 'success', title: 'Ficha médica asociada con exito', text: '' })
          setIsLoading(false)
        } catch (error) {
          console.log(error)
          //@ts-ignore
          addErrorToast(error)
          setIsLoading(false)
        }
      }
      send()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])
 */
  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors 
    // TODO: Clear comments
    useEffect(() => {
    if (showEditModal === false) {
      //go to first tab
      setValue(0)
    }
  }, [showEditModal]) */

  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors
    // TODO: Clear comments
    useEffect(() => {
    if (encounterHistory.length > 0) {
      //disable mainReason and show first mainReason record
      setDisableMainReason(true)
      setMainReason(encounterHistory[0].mainReason)
    }
  }, [encounterHistory]) */

  const debounce = useCallback(
    _.debounce(async (_encounter: object) => {
      const url = `/profile/doctor/appointments/${id}/encounter`
      try {
        //setIsLoading(true)
        const res = await axios.put(url, _encounter)
        console.log('response', res.data)
        //setIsLoading(false)
        addToast({ type: 'success', title: 'Ficha médica actualizada con exito', text: '' })
      } catch (err) {
        //setIsLoading(false)
        const tags = {
          'endpoint': url,
          'method': 'PUT',
          'appointment_id': id
        }
        handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_PUT, tags)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No fue posible actualizar. ¡Inténtelo nuevamente más tarde!'
        })
      }
    }, 5000),
    []
  )

  useEffect(() => {
    const getPrivateCommentsRecords = async () => {
      const url = `/profile/doctor/relatedEncounters/${encounterId}/privateComments`
      try {
        const res = await axios.get(url)
        setPrivateCommentsRecords(res.data.encounter.items)
      } catch (err) {
        console.log(err)
        const tags = {
          "endpoint": url,
          "method": "GET",
          "encounter-id": encounterId
        }
        handleSendSentry(err, ERROR_HEADERS.PRIVATE_COMMETS.FAILURE_GET, tags)
        addErrorToast('Algo salió mal, vuelve a intentarlo')
      }
    }
    if (encounterId !== '') getPrivateCommentsRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterId])

  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors
    // TODO: Clear comments
  const CustomToolTip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#EDF2F7',
      color: 'black',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
    },
  }))(Tooltip) */

  const ToolTipSoepHelper = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#FFFF',
      color: 'black',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      borderWidth: '2px',
      borderColor: '#d0ebee',
      borderStyle: 'solid',
      borderRadius: '10px',
    },
  }))(Tooltip)

  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors
    // TODO: Clear comments
  const toolTipData = ({
    iconItem,
    date,
    title,
    body,
  }: {
    iconItem: number
    date: any
    title: String
    body: String
  }) => {
    return (
      <React.Fragment key={iconItem}>
        <Grid container>
          {iconItem === 1 ? (
            <FirstSoepIcon style={{ marginTop: '3px' }} />
          ) : iconItem === 2 ? (
            <SecondSoepIcon />
          ) : (
            <ThirdSoepIcon />
          )}

          <Typography style={{ paddingLeft: '10px' }} variant='subtitle1' color='textSecondary'>
            {date}
          </Typography>
        </Grid>
        <Grid>
          <Typography style={{ color: '#27BEC2', fontSize: '18px' }}>{title}</Typography>
          <Typography variant='subtitle1' color='textPrimary'>
            {body}{' '}
          </Typography>
        </Grid>
      </React.Fragment>
    )
  } */
  const showSoepHelper = ({ title }: { title: String }) => {
    var description = ''
    switch (title) {
      case 'Subjetivo':
        description =
          'Aquí se consignan los datos recogidos en el interrogatorio, conjuntamente con las impresiones subjetivas del médico y las expresadas por el paciente.'
        break
      case 'Objetivo':
        description = 'En este apartado se anotan los datos del examen físico y / o exámenes complementarios.'
        break
      case 'Evaluacion':
        description = 'En esta sección se registra la interpretación del problema identificado y su reevaluación'
        break
      case 'Plan':
        description =
          'Aquí se registra la planificación de las conductas que se tomarán. Existen cuatro tipos de planes: · Plan diagnóstico · Plan terapéutico · Plan de seguimiento · Plan de educación.'
        break

      default:
        break
    }

    return (
      <ToolTipSoepHelper title={description}>
        <Grid style={{ paddingLeft: '10px', paddingTop: '5px' }}>{<HelpIcon />}</Grid>
      </ToolTipSoepHelper>
    )
  }
  /* 
    // It was decided to hide the implementation of the first and follow-up query. 
    // Because it's not very clear to the doctors
    // TODO: Clear comments
  const showSoepRecords = ({ title }: { title: String }) => {
    const tempArray = []
    if (encounterHistory.length > 0) {
      //only show the last three record
      const encounterCounter = encounterHistory.length > 3 ? 3 : encounterHistory.length

      for (var i = 0; i < encounterCounter; i++) {
        const { objective, subjective, evaluation, plan } = encounterHistory[i].soep
        const { startTimeDate, appointmentId } = encounterHistory[i]
        switch (title) {
          case 'Objetivo':
            tempArray.push(
              <CustomToolTip
                key={appointmentId}
                title={toolTipData({ iconItem: i + 1, title: title, body: objective, date: startTimeDate })}
              >
                <Grid style={{ paddingLeft: '10px' }}>
                  {i === 0 ? <FirstSoepLabel /> : i === 1 ? <SecondSoepLabel /> : <ThirdSoepLabel />}
                </Grid>
              </CustomToolTip>
            )
            break

          case 'Subjetivo':
            tempArray.push(
              <CustomToolTip
                key={appointmentId}
                title={toolTipData({ iconItem: i + 1, title: title, body: subjective, date: startTimeDate })}
              >
                <Grid style={{ paddingLeft: '10px' }}>
                  {i === 0 ? <FirstSoepLabel /> : i === 1 ? <SecondSoepLabel /> : <ThirdSoepLabel />}
                </Grid>
              </CustomToolTip>
            )
            break

          case 'Evaluacion':
            tempArray.push(
              <CustomToolTip
                key={appointmentId}
                title={toolTipData({ iconItem: i + 1, title: 'Evaluación', body: evaluation, date: startTimeDate })}
              >
                <Grid style={{ paddingLeft: '10px' }}>
                  {i === 0 ? <FirstSoepLabel /> : i === 1 ? <SecondSoepLabel /> : <ThirdSoepLabel />}
                </Grid>
              </CustomToolTip>
            )
            break
          case 'Plan':
            tempArray.push(
              <CustomToolTip
                key={appointmentId}
                title={toolTipData({ iconItem: i + 1, title: title, body: plan, date: startTimeDate })}
              >
                <Grid style={{ paddingLeft: '10px' }}>
                  {i === 0 ? <FirstSoepLabel /> : i === 1 ? <SecondSoepLabel /> : <ThirdSoepLabel />}
                </Grid>
              </CustomToolTip>
            )
            break

          default:
            break
        }
      }
    }
    return tempArray
  } */
  const classes = useStyles()
  if (initialLoad)
    return (
      <div style={{ width: '300px' }} className='flex items-center justify-center w-full h-full py-64'>
        <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
          <svg
            className='w-6 h-6 text-secondary-500 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      </div>
    )
  return (
    <div className='flex flex-col h-full overflow-y-auto scrollbar bg-white shadow-xl'>
      <Grid>
        <CardHeader
          title='Notas médicas'
          titleTypographyProps={{ variant: 'h6' }}
          style={{ backgroundColor: '#27BEC2', color: 'white' }}
          action={
            <button onClick={() => setShowPrivateCommentMenu(true)} style={{ padding: '10px', outline: 'none' }}>
              {' '}
              {privateCommentsRecord.length <= 0 ? (
                <PrivateCommentIcon />
              ) : privateCommentsRecord.length === 1 ? (
                <PrivateCommentIconBadge />
              ) : (
                <PrivateCommentIconBadgesExtra />
              )}{' '}
            </button>
          }
        />

        <CardContent>
          {showPrivateCommentMenu === true ? (
            <PrivateComments
              encounterId={encounterId}
              appointment={appointment}
              setDataCallback={(elem: any) => {
                setShowPrivateCommentMenu(false)
              }}
            />
          ) : (
            <Grid style={{ paddingTop: '25px' }}>
              <Grid>
                <Typography variant='h6' color='textPrimary'>
                  {appointment.patient.givenName} {appointment.patient.familyName}
                </Typography>

                <Typography variant='subtitle1' color='textSecondary'>
                  Ci: {appointment.patient.identifier}
                </Typography>
              </Grid>

              {/* 
                  // It was decided to hide the implementation of the first and follow-up query. 
                  // Because it's not very clear to the doctors
                  // TODO: Clear comments
                <Grid style={{ marginTop: '25px' }}>
                  <Tabs
                    classes={{
                      root: classes.tabHeight,
                    }}
                    TabIndicatorProps={{
                      style: { backgroundColor: 'white', marginTop: '20px', marginBottom: '20px', display: 'none' },
                    }}
                    value={value}
                    onChange={handleChange}
                  >
                    <Tab
                      style={{
                        backgroundColor: '#27BEC2',
                        borderStartStartRadius: '10px',
                        borderBottomLeftRadius: '10px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}
                      label='1ra consulta'
                      {...a11yProps(0)}
                    />
                    <Tab
                      disabled={isAppointmentDisabled}
                      onClick={() => {
                        setShowEditModal(true)
                      }}
                      label='Seguimiento'
                      style={{
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                        borderWidth: '1px',
                        borderColor: '#27BEC2',
                        borderStyle: 'solid',
                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </Grid> 
              */}

              <TabPanel classes={{ root: classes.tab }} value={value} index={0}>
                <Typography variant='subtitle1' color='textPrimary' style={{ marginTop: '20px' }}>
                  Motivo principal de la visita <span className={`${mainReasonRequired ? 'text-red-700' : 'text-gray-500'}`}>{appointment?.status === 'upcoming' || appointment?.status === 'closed' || appointment?.status === 'locked' ? '' : '(obligatorio)'}</span>
                </Typography>

                <TextField
                  fullWidth
                  disabled={disableMainReason || isAppointmentDisabled}
                  autoFocus
                  variant='outlined'
                  placeholder={' Ej: Dolor de cabeza prolongado'}
                  style={{
                    background: `${disableMainReason || isAppointmentDisabled ? '#f4f5f7' : '#ffff'}`,
                  }}
                  value={mainReason}
                  onChange={event => {
                    setMainReason(event.target.value)
                  }}
                  required
                />

                <Accordion
                  classes={{
                    root: classes.MuiAccordionroot,
                  }}
                  style={{
                    backgroundColor: '#EDF8F9A6',
                    boxShadow: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    marginTop: '30px',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ fill: '#177274' }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    onMouseEnter={() => setShowHover('Subjetivo')}
                    onMouseLeave={() => setShowHover('')}
                  >
                    <Typography style={{ color: '#177274' }}>Subjetivo</Typography>
                    {showHover === 'Subjetivo' && showSoepHelper({ title: 'Subjetivo' })}
                    <Grid
                      container
                      justifyContent='flex-end'
                      style={{
                        marginRight: '0',
                        marginLeft: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      {/* {showSoepRecords({ title: 'Subjetivo' })}{' '} */}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      disabled={isAppointmentDisabled || mainReasonRequired}
                      multiline
                      rows='9'
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.input }
                      }}
                      style={{
                        borderRadius: '4px',
                        background: `${disableMainReason || isAppointmentDisabled ? '#f4f5f7' : '#ffff'}`,
                      }}
                      value={subjective}
                      onChange={event => {
                        setSubjective(event.target.value)
                      }}
                      placeholder={soepPlaceholder['Subjetivo']}
                      required
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  classes={{
                    root: classes.MuiAccordionroot,
                  }}
                  style={{
                    backgroundColor: '#EDF8F9A6',
                    boxShadow: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    marginTop: '10px',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ fill: '#177274' }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    onMouseEnter={() => setShowHover('Objetivo')}
                    onMouseLeave={() => setShowHover('')}
                  >
                    <Typography style={{ color: '#177274' }}>Objetivo</Typography>
                    {showHover === 'Objetivo' && showSoepHelper({ title: 'Objetivo' })}
                    <Grid
                      container
                      justifyContent='flex-end'
                      style={{
                        marginRight: '0',
                        marginLeft: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      {/* {showSoepRecords({ title: 'Objetivo' })}{' '} */}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      disabled={isAppointmentDisabled || mainReasonRequired}
                      fullWidth
                      multiline
                      rows='9'
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.input }
                      }}
                      style={{
                        background: `${disableMainReason || isAppointmentDisabled ? '#f4f5f7' : '#ffff'}`,
                        // border: '2px solid #AAAAAA',
                        // boxSizing: 'border-box',
                        borderRadius: '4px',
                      }}
                      required
                      value={objective}
                      onChange={event => {
                        setObjective(event.target.value)
                      }}
                      placeholder={soepPlaceholder['Objetivo']}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  classes={{
                    root: classes.MuiAccordionroot,
                  }}
                  style={{
                    backgroundColor: '#EDF8F9A6',
                    boxShadow: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    marginTop: '10px',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ fill: '#177274' }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    onMouseEnter={() => setShowHover('Evaluacion')}
                    onMouseLeave={() => setShowHover('')}
                  >
                    <Typography style={{ color: '#177274' }}>Evaluación</Typography>
                    {showHover === 'Evaluacion' && showSoepHelper({ title: 'Evaluacion' })}
                    <Grid
                      container
                      justifyContent='flex-end'
                      style={{
                        marginRight: '0',
                        marginLeft: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      {/* {showSoepRecords({ title: 'Evaluacion' })}{' '} */}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      disabled={isAppointmentDisabled || mainReasonRequired}
                      fullWidth
                      multiline
                      rows='9'
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.input }
                      }}
                      style={{
                        background: `${disableMainReason || isAppointmentDisabled ? '#f4f5f7' : '#ffff'}`,
                        // border: '2px solid #AAAAAA',
                        // boxSizing: 'border-box',
                        borderRadius: '4px',
                      }}
                      required
                      value={evaluation}
                      onChange={event => {
                        setEvaluation(event.target.value)
                      }}
                      placeholder={soepPlaceholder['Evaluacion']}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion
                  classes={{
                    root: classes.MuiAccordionroot,
                  }}
                  style={{
                    backgroundColor: '#EDF8F9A6',
                    boxShadow: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    marginTop: '10px',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ fill: '#177274' }} />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    onMouseEnter={() => setShowHover('Plan')}
                    onMouseLeave={() => setShowHover('')}
                  >
                    <Typography style={{ color: '#177274' }}>Plan</Typography>
                    {showHover === 'Plan' && showSoepHelper({ title: 'Plan' })}
                    <Grid
                      container
                      justifyContent='flex-end'
                      style={{
                        marginRight: '0',
                        marginLeft: 'auto',
                        marginBottom: 'auto',
                        color: 'white',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        borderRadius: '5px',
                      }}
                    >
                      {/* {showSoepRecords({ title: 'Plan' })}{' '} */}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      disabled={isAppointmentDisabled || mainReasonRequired}
                      fullWidth
                      multiline
                      rows='9'
                      InputProps={{
                        disableUnderline: true,
                        classes: { input: classes.input }
                      }}
                      style={{
                        background: `${disableMainReason || isAppointmentDisabled ? '#f4f5f7' : '#ffff'}`,
                        // border: '2px solid #AAAAAA',
                        // boxSizing: 'border-box',
                        borderRadius: '4px',
                      }}
                      required
                      value={plan}
                      onChange={event => {
                        setPlan(event.target.value)
                      }}
                      placeholder={soepPlaceholder['Plan']}
                    />
                  </AccordionDetails>
                </Accordion>
              </TabPanel>
              {/* 
                // It was decided to hide the implementation of the first and follow-up query. 
                // Because it's not very clear to the doctors 
                // TODO: Clear comments
              <TabPanel value={value} index={1}>
                <Modal show={showEditModal} setShow={setShowEditModal} size='xl3'>
                  <Typography variant='body1' color='textSecondary'>
                    Paciente
                  </Typography>
                  <Typography variant='body1' color='textPrimary'>
                    {appointment.patient.givenName} {appointment.patient.familyName}
                  </Typography>

                  <Typography style={{ marginBottom: '15px' }} variant='subtitle2' color='textSecondary'>
                    CI: {appointment.patient.identifier}
                  </Typography>

                  <MaterialTable
                    title='Seleccionar consulta'
                    icons={tableIcons}
                    localization={{
                      body: {
                        emptyDataSourceMessage: 'No hay datos por mostrar',
                      },
                      pagination: {
                        firstAriaLabel: 'Primera página',
                        firstTooltip: 'Primera página',
                        labelDisplayedRows: '{from}-{to} de {count}',
                        labelRowsPerPage: 'Filas por página:',
                        labelRowsSelect: 'filas',
                        lastAriaLabel: 'Ultima página',
                        lastTooltip: 'Ultima página',
                        nextAriaLabel: 'Pagina siguiente',
                        nextTooltip: 'Pagina siguiente',
                        previousAriaLabel: 'Pagina anterior',
                        previousTooltip: 'Pagina anterior',
                     },
                     toolbar: {
                      searchPlaceholder: 'Buscar',
                      searchTooltip: 'Buscar',
                    },
                    }}
                    columns={[
                      {
                        title: 'Fecha',
                        field: 'startTimeDate',
                      },
                      {
                        title: 'Motivo de visita',
                        field: 'mainReason',
                      },
                      // {
                      //   title: "Diagnóstico",
                      //   field: "diagnosis"
                      // },
                      {
                        title: 'Diagnóstico',
                        field: 'diagnosis',
                        render: rowData => {
                          //@ts-ignore
                          return isLoading === true && selectedRow !== undefined && selectedRow.id === rowData.id ? (
                            <Grid style={{ width: '130px' }} container>
                              <img src={loading} width='30px' alt='loading...' />{' '}
                              <p style={{ marginTop: '3px' }}>habilitando...</p>{' '}
                            </Grid>
                          ) : (
                            <p>{rowData.diagnosis}</p>
                          )
                        },
                      },
                    ]}
                    data={soepHistory}
                    onRowClick={(evt, selectedRow) =>
                      //@ts-ignore
                      setSelectedRow(selectedRow)
                    }
                    options={{
                      search: true,
                      toolbar: true,
                      paging: true,
                      draggable: false,
                      pageSize: 5,
                      rowStyle: rowData => ({
                        backgroundColor:
                          // @ts-ignore
                          selectedRow !== undefined && selectedRow.id === rowData.id ? '#D4F2F3' : '#FFF',
                      }),
                    }}
                  />
                </Modal>
              </TabPanel> */}
            </Grid>
          )}
        </CardContent>
      </Grid>
    </div>
  )
}

interface CallStatusMessageProps {
  status: Status
  statusText?: string
  updateStatus: (status?: Status) => void
  appointmentId: string
}

const CallStatusMessage = ({ status, statusText, updateStatus, appointmentId }: CallStatusMessageProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='flex items-center justify-center flex-grow'>
      {status === 'upcoming' && (
        <div className='max-w-xs m-4'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full'>
            {/* Heroicon name: clock */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              className='w-6 h-6 text-green-600'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
              ¡Se aproxima una cita!
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>{statusText}</p>
            </div>

            <div className='w-full px-3 mt-5'>
              <span className='relative inline-flex w-full rounded-md shadow-sm'>
                <button
                  style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  type='button'
                  className=' inline-flex items-center  w-full  px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                  onClick={() => {
                    setIsOpen(true)
                  }}
                >
                  Cancelar Cita
                </button>
              </span>
              <>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <CancelAppointmentModal isOpen={isOpen} setIsOpen={setIsOpen} appointmentId={appointmentId} />
                </div>
              </>
            </div>
          </div>
        </div>
      )}
      {status === 'open' && (
        <div className='max-w-xs m-4'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
            <svg
              className='w-6 h-6 text-secondary-500 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
              Esperando a que el paciente se una
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Cuando el paciente se una desde la app estarás conectado.</p>
            </div>
          </div>
          <div className='mt-2'>
            <p className='text-sm text-center text-gray-500'>
              Haga clic en "Cerrar Cita" para cerrar la sala de espera para el paciente.
            </p>
          </div>
          <div className='mt-5 sm:mt-4'>
            <button
              onClick={() => updateStatus('closed')}
              className='w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm'
            >
              Cerrar Cita
            </button>
          </div>
        </div>
      )}

      {status === 'closed' && (
        <div className='max-w-xs m-4'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
            <svg
              className='w-6 h-6 text-primary-500'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
              ¡Cita Cerrada!
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                El paciente ya no puede unirse. Si desea volver a conectarse con el paciente, por favor haga clic aquí.
              </p>
            </div>
          </div>
          <div className='mt-5 sm:mt-4'>
            <button
              onClick={() => updateStatus('open')}
              className='w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
            >
              Abrir Cita
            </button>
          </div>
        </div>
      )}
      {status === 'locked' && (
        <div className='max-w-xs m-4'>
          <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
            <svg
              className='w-6 h-6 text-secondary-600'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <div className='mt-3 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
              ¡Cita Finalizada!
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Esta cita está cerrada.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const lookupGender = (gender: string) => {
  switch (gender) {
    case 'male':
      return 'Masculino'
    case 'female':
      return 'Femenino'
    case 'other':
      return 'Otro'
    default:
      return ''
  }
}
