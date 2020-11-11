import React, { useState, useReducer, useMemo, useRef, useEffect, useContext } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import { EventInput, EventSourceFunc, EventClickArg } from '@fullcalendar/common'
import axios from 'axios'
import { addDays, differenceInDays, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'

import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { validateDate, validateTime } from '../util/helpers'
import { UserContext } from '../App'

const eventDataTransform = (event: Boldo.Appointment) => {
  const getColorClass = (eventType: Boldo.Appointment['type']) => {
    if (eventType === 'Appointment') return 'event-appointment'
    if (eventType === 'PrivateEvent') return 'event-private'
    return 'event-other'
  }

  return {
    title: event.name || event.patientId,
    start: event.start,
    end: event.end,
    classNames: [getColorClass(event.type), 'boldo-event'],
    extendedProps: event,
  }
}

const calculateOpenHours = (openHours: Boldo.OpenHours, start: Date, end: Date) => {
  // Create list of days
  const days = differenceInDays(end, start)
  const daysList = [...Array(days + 1).keys()].map(i => addDays(start, i))

  return daysList.flatMap(day => {
    const dayOfTheWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][day.getDay()] as keyof Boldo.OpenHours
    const openHoursOfDay = openHours[dayOfTheWeek]

    return openHoursOfDay.map(openHour => {
      const startDate = new Date(day)
      startDate.setHours(0, openHour.start, 0)
      const endDate = new Date(day)
      endDate.setHours(0, openHour.end, 0)

      return { start: startDate, end: endDate }
    })
  })
}

const appointmentTypes = {
  PrivateEvent: 'Private Event',
  CustomAppointment: 'Patient Consultation',
}

type AppointmentForm = Omit<Boldo.Appointment, 'start' | 'end' | 'patientId' | 'doctorId'> & {
  // Form has date and time seperate
  start: string
  end: string
  date: string
}

const initialAppointment = {
  id: 'new',
  name: '',
  start: '',
  end: '',
  date: '',
  description: '',
  type: 'PrivateEvent',
} as AppointmentForm

type Action =
  | { type: 'reset' }
  | { type: 'initial'; value: AppointmentForm }
  | { type: 'default'; value: Partial<AppointmentForm> }

function reducer(state: AppointmentForm, action: Action): AppointmentForm {
  switch (action.type) {
    case 'default':
      return { ...state, ...action.value }
    case 'reset':
      return initialAppointment
    case 'initial':
      return action.value
    default:
      throw new Error()
  }
}

interface Room {
  users: string[]
  roomId: string
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<EventInput[]>([])
  const [dateRange, setDateRange] = useState<{ start: string; end: string; refetch: boolean }>({
    start: '',
    end: '',
    refetch: false,
  })
  const [appointment, dispatch] = useReducer(reducer, initialAppointment)

  const calendar = useRef<FullCalendar>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Boldo.Appointment | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useContext(UserContext)
  const { openHours } = user || {}

  // FIXME: Can this be improved?
  const setAppointmentsAndReload: typeof setAppointments = arg0 => {
    setAppointments(arg0)
    setDateRange(range => ({ ...range, refetch: true }))
  }

  const isNew = useMemo(() => {
    return appointment.id === 'new'
  }, [appointment.id])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    let validationError = false

    // Validate Date. Because Safari does not have date input
    if (!validateDate(appointment.date)) {
      validationError = true
      setError('Invalid Date!')
    }

    // Validate Time. Because Safari does not have time input
    if (!validateTime(appointment.start) || !validateTime(appointment.end)) {
      validationError = true
      setError('Invalid Start or End!')
    }

    if (validationError) return setLoading(false)

    try {
      const payload = {
        ...appointment,
        start: new Date(`${appointment.date}T${appointment.start}`).toISOString(),
        end: new Date(`${appointment.date}T${appointment.end}`).toISOString(),
      }

      const res = await axios.post<Boldo.Appointment>(`/profile/doctor/appointments`, payload)

      // Useless setting data as will anyways reload?
      setAppointmentsAndReload(appointments => [eventDataTransform(res.data), ...appointments])
      setShowEditModal(false)
      dispatch({ type: 'reset' })
    } catch (err) {
      setError(err.response?.data.message || 'Ha ocurrido un error! Intente de nuevo.')
    }

    setLoading(false)
  }

  // FIXME: It's a mess how this handles the loadEvents. It should work:
  // This loads Events whenever needed and setsState
  // FC automaticall rerenders when appointmens[] has changed.
  // Check why it doesn't work like that.
  const loadEvents: EventSourceFunc = (info, successCallback, failureCallback) => {
    const start = info.start.toISOString().split('T')[0]
    const end = info.end.toISOString().split('T')[0]
    if (start === dateRange.start && end === dateRange.end && !dateRange.refetch) return successCallback(appointments)
    axios
      .get<Boldo.Appointment[]>('/profile/doctor/appointments')
      .then(res => {
        const events = res.data.map(event => eventDataTransform(event))

        const openHourDates = openHours ? calculateOpenHours(openHours, info.start, info.end) : []
        const openHourDatesTransformed = openHourDates.map(event => ({ ...event, display: 'background' }))

        setDateRange({ start, end, refetch: false })
        setAppointments([...events, ...openHourDatesTransformed])
        // successCallback(events) // Don't use it here to fix a bug with FullCalendar
      })
      .catch(err => {
        console.log(err)
        failureCallback(err)
      })
  }

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.stopPropagation()
    if (info.event.display !== 'background') setSelectedAppointment(info.event.extendedProps as Boldo.Appointment)
  }

  return (
    <>
      <Layout>
        <div className='flex flex-col h-full text-cool-gray-700'>
          <div className='flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8'>
            <div className='flex-1 min-w-0'>
              <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate'>
                Mi Horario
              </h1>
            </div>
            <div className='flex mt-4 md:mt-0 md:ml-4'>
              <span className='ml-3 rounded-md shadow-sm'>
                <button
                  type='button'
                  className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                  onClick={e => {
                    e.stopPropagation()
                    dispatch({ type: 'reset' })
                    setError('')
                    setShowEditModal(true)
                  }}
                >
                  Add Event
                </button>
              </span>
            </div>
          </div>

          <FullCalendar
            ref={calendar}
            events={{ events: loadEvents, id: 'server' }}
            eventClick={handleEventClick}
            height='100%'
            stickyHeaderDates={true}
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
            initialView='timeGridWeek'
            nowIndicator={true}
            locale={esLocale}
            dayHeaderFormat={{ weekday: 'long', day: 'numeric', omitCommas: true }}
            dayHeaderContent={({ text, isToday }) => {
              const [weekday, day] = text.split(' ')
              return (
                <div
                  className={
                    'flex flex-col font-medium leading-tight uppercase ' +
                    (isToday ? 'text-primary-500' : 'text-gray-500')
                  }
                >
                  <span className='hidden text-xs sm:inline'>{weekday}</span>
                  <span className='text-3xl'>{day}</span>
                </div>
              )
            }}
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridThreeDay,listWeek',
            }}
            titleFormat={{ year: 'numeric', month: 'short' }}
            views={{
              timeGridThreeDay: {
                type: 'timeGrid',
                duration: { days: 3 },
                buttonText: '3 day',
              },
            }}
            expandRows={true}
            allDaySlot={false}
            slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
          />
        </div>
      </Layout>
      <Modal show={showEditModal} setShow={setShowEditModal} size='xl' noPadding>
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
            <div>
              <div className='sm:hidden'>
                <select
                  aria-label='Selected tab'
                  className='block w-full form-select'
                  value={appointment.type}
                  onChange={e =>
                    dispatch({ type: 'default', value: { type: e.target.value as keyof typeof appointmentTypes } })
                  }
                >
                  {(Object.keys(appointmentTypes) as Array<keyof typeof appointmentTypes>).map(appointmentType => (
                    <option key={appointmentType} value={appointmentType}>
                      {appointmentTypes[appointmentType]}
                    </option>
                  ))}
                </select>
              </div>
              <div className='hidden sm:block'>
                <div className='border-b border-gray-200'>
                  <nav className='flex -mb-px'>
                    {(Object.keys(appointmentTypes) as Array<keyof typeof appointmentTypes>).map(appointmentType => (
                      <button
                        key={appointmentType}
                        type='button'
                        onClick={() => dispatch({ type: 'default', value: { type: appointmentType } })}
                        className={`w-1/2 px-1 py-4 text-sm font-medium leading-5 text-center border-b-2 focus:outline-none ${
                          appointment.type === appointmentType
                            ? 'text-indigo-600 border-indigo-500 focus:text-indigo-800 focus:border-indigo-700'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                        }`}
                      >
                        {appointmentTypes[appointmentType]}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className='mt-4 sm:flex sm:items-start'>
              <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-secondary-100 sm:mx-0 sm:h-10 sm:w-10'>
                <svg
                  className='w-6 h-6 text-secondary-500'
                  xmlns='http://www.w3.org/2000/svg'
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
              </div>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
                  Private Event
                </h3>
                <div className='mt-2'>
                  <p className='text-sm leading-5 text-gray-500'>
                    Add a new event. This event is only visible for you. It will block patients from booking into this
                    timeslot.
                  </p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 row-gap-4 col-gap-4 mt-6 sm:grid-cols-6'>
              <div className='sm:col-span-6'>
                <label htmlFor='appointment_name' className='block text-sm font-medium leading-5 text-gray-700'>
                  Nombre
                </label>
                <div className='mt-1 rounded-md shadow-sm'>
                  <input
                    id='appointment_name'
                    className='block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5'
                    value={appointment.name}
                    onChange={e => dispatch({ type: 'default', value: { name: e.target.value } })}
                    required
                    type='text'
                  />
                </div>
              </div>
              <div className='sm:col-span-2'>
                <label htmlFor='appointment_day' className='block text-sm font-medium leading-5 text-gray-700'>
                  Fecha
                </label>
                <div className='relative mt-1 rounded-md shadow-sm'>
                  <input
                    id='appointment_day'
                    className='block w-full form-input sm:text-sm sm:leading-5'
                    onChange={e => dispatch({ type: 'default', value: { date: e.target.value } })}
                    value={appointment.date}
                    required
                    type='date'
                    placeholder='yyyy-mm-dd'
                  />
                </div>
              </div>
              <div className='sm:col-span-4'>
                <label className='block text-sm font-medium leading-5 text-gray-700'>Time</label>
                <div className='flex-grow mt-1 bg-white rounded-md shadow-sm'>
                  <div className='flex -mt-px'>
                    <div className='flex flex-1 w-1/2 min-w-0'>
                      <label
                        htmlFor='appointment_start'
                        className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm'
                      >
                        start
                      </label>
                      <input
                        id='appointment_start'
                        className='flex-1 block w-full min-w-0 transition duration-150 ease-in-out rounded-none form-input sm:text-sm sm:leading-5'
                        type='time'
                        placeholder='hh:mm'
                        onChange={e => dispatch({ type: 'default', value: { start: e.target.value } })}
                        value={appointment.start}
                        required
                      />
                    </div>
                    <div className='flex flex-1 min-w-0 -ml-px'>
                      <label
                        htmlFor='appointment_end'
                        className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 bg-gray-50 sm:text-sm'
                      >
                        end
                      </label>
                      <input
                        id='appointment_end'
                        className='flex-1 block w-full min-w-0 transition duration-150 ease-in-out rounded-none form-input rounded-r-md sm:text-sm sm:leading-5'
                        type='time'
                        placeholder='hh:mm'
                        onChange={e => dispatch({ type: 'default', value: { end: e.target.value } })}
                        value={appointment.end}
                        required
                        min={appointment.start}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='sm:col-span-6'>
                <label htmlFor='appointment_description' className='block text-sm font-medium leading-5 text-gray-700'>
                  Descripción
                </label>
                <div className='mt-1 rounded-md shadow-sm'>
                  <textarea
                    id='appointment_description'
                    className='block w-full transition duration-150 ease-in-out form-input sm:text-sm sm:leading-5'
                    value={appointment.description}
                    onChange={e => dispatch({ type: 'default', value: { description: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className='px-4 pt-2 text-right bg-gray-50 sm:px-6'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
          <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:justify-end'>
            {/* {appointment.id !== 'new' ? (
            <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
              <button
                type='button'
                className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red sm:text-sm sm:leading-5'
                onClick={() => handleDelete(appointment.id)}
              >
                Eliminar
              </button>
            </span>
          ) : (
            <div />
          )} */}
            <div className='sm:flex'>
              <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                <button
                  type='button'
                  className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'
                  onClick={() => {
                    setShowEditModal(false)
                    dispatch({ type: 'reset' })
                  }}
                >
                  Cancelar
                </button>
              </span>
              <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
                <button
                  type='submit'
                  className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-indigo-700 transition duration-150 ease-in-out bg-indigo-100 border-gray-300 rounded-md shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200'
                  disabled={loading}
                >
                  {loading && (
                    <svg className='w-5 h-5 mr-2 -ml-1 text-indigo-700 animate-spin' fill='none' viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  )}
                  {isNew ? 'Crear' : 'Actualizar'}
                </button>
              </span>
            </div>
          </div>
        </form>
      </Modal>
      {selectedAppointment && (
        <EventModal
          setShow={show => {
            if (!show) setSelectedAppointment(null)
          }}
          appointment={selectedAppointment}
          setAppointmentsAndReload={setAppointmentsAndReload}
        />
      )}
    </>
  )
}

interface EventModalProps {
  setShow: (arg: boolean) => void
  appointment: Boldo.Appointment
  setAppointmentsAndReload: (arg: any) => void
}

const EventModal = ({ setShow, appointment, setAppointmentsAndReload }: EventModalProps) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const date = useMemo(() => {
    const date = new Intl.DateTimeFormat('default', {
      weekday: 'long',
      // year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(appointment.start))

    const start = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(appointment.start))

    const end = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(appointment.end))

    return { date, start, end }
  }, [appointment])

  const type = useMemo(() => {
    let type = ''
    switch (appointment.type) {
      case 'PrivateEvent':
        type = 'Private Event'
        break

      case 'CustomAppointment':
        type = 'Custom Patient Consultation'
        break

      case 'Appointment':
        type = 'Scheduled Patient Consultation'
        break

      default:
        type = 'Other'
        break
    }
    return type
  }, [appointment])

  const hasPicture = appointment.type === 'Appointment'

  useEffect(() => {
    if (appointment.type === 'Appointment') {
      const calculate = () => {
        const minutes = differenceInMinutes(parseISO(appointment.start as any), Date.now())
        if (minutes < 15) {
          setStatus('open')
        } else if (minutes < 16) {
          const seconds = differenceInSeconds(parseISO(appointment.start as any), Date.now())
          setStatus(`opens in ${seconds + 1 - 60 * 15} seconds`)
        } else if (minutes < 60) {
          setStatus(`opens in ${minutes - 14} minutes`)
        } else {
          setStatus(`Will open 15 minutes before start`)
        }
      }
      calculate()
      const timer = setInterval(() => {
        calculate()
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [appointment])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Está seguro que desea eliminar esta Event?')) return
    setLoading(true)
    setError('')
    try {
      await axios.delete(`/profile/doctor/appointments/${id}`)
      setAppointmentsAndReload((appointments: EventInput[]) =>
        appointments.filter(appointment => appointment.extendedProps?.id !== id)
      )
      setLoading(false)
      setShow(false)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data.message || 'Ha ocurrido un error! Intente de nuevo.')
      console.log(err)
    }
  }

  return (
    <Modal show={true} setShow={setShow} size='xl' noPadding>
      <div className=''>
        <div className='divide-y divide-gray-200'>
          <div className='pb-6'>
            <div className='h-24 bg-primary-700 sm:h-20 lg:h-28' />
            <div
              className={`flow-root px-4 space-y-6 sm:flex sm:items-end sm:px-6 sm:space-x-6 ${
                hasPicture ? '-mt-12 lg:-mt-15 sm:-mt-8' : ''
              }`}
            >
              {hasPicture && (
                <div>
                  <div className='flex -m-1'>
                    <div className='inline-flex overflow-hidden border-4 border-white rounded-lg'>
                      <img
                        className='flex-shrink-0 w-24 h-24 sm:h-40 sm:w-40 lg:w-48 lg:h-48'
                        src='/img/patient-f.svg'
                        alt=''
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className='mt-6 space-y-5 sm:flex-1'>
                <div>
                  <div className='flex items-center space-x-2.5'>
                    <h3 className='text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:leading-8'>
                      {appointment.name || appointment.patientId}
                    </h3>
                    <span
                      aria-label='Online'
                      className='flex-shrink-0 inline-block w-2 h-2 bg-green-400 rounded-full'
                    />
                  </div>
                  <p className='space-x-2 text-sm leading-5 text-gray-500'>
                    <span>{date.date}</span>
                    <span>⋅</span>
                    <span>
                      {date.start} – {date.end}
                    </span>
                  </p>
                </div>
                {status === 'open' && (
                  <div className='flex flex-wrap'>
                    <span className='inline-flex flex-shrink-0 w-full rounded-md shadow-sm sm:flex-1'>
                      <Link
                        to={`/appointments/${appointment.id}/call`}
                        className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700'
                      >
                        Start Call
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='px-4 py-5 sm:px-0 sm:py-0'>
            <dl className='space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
              {appointment.description && (
                <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                  <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>
                    Description
                  </dt>
                  <dd className='mt-1 overflow-auto text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                    <p className='break-words'>{appointment.description}</p>
                  </dd>
                </div>
              )}
              <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Type</dt>
                <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>{type}</dd>
              </div>
              {status && (
                <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                  <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>
                    Status
                  </dt>
                  <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>{status}</dd>
                </div>
              )}
              {/* <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>
                  Birthday
                </dt>
                <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                  <time dateTime='1982-06-23'>June 23, 1982</time>
                </dd>
              </div> */}
            </dl>
          </div>
        </div>
      </div>

      <div className='px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:justify-between'>
        <div className='flex items-center'>
          {appointment.type === 'PrivateEvent' && (
            <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
              <button
                type='button'
                className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red sm:text-sm sm:leading-5'
                onClick={() => handleDelete(appointment.id)}
                disabled={loading}
              >
                Eliminar
              </button>
            </span>
          )}
        </div>
        {error && <p className='mx-4 text-sm text-red-600'>{error}</p>}
        <div className='flex items-center'>
          <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
            <button
              type='button'
              className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'
              onClick={() => {
                setShow(false)
              }}
            >
              Close
            </button>
          </span>
          <p></p>
        </div>
      </div>
    </Modal>
  )
}
