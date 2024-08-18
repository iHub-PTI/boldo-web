import React, { useState, useReducer, useMemo, useRef, useEffect, useContext } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import { EventInput, EventSourceFunc, EventClickArg } from '@fullcalendar/common'
import * as Sentry from '@sentry/react'
import axios from 'axios'
import { addDays, differenceInDays, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns'
import { Link, useHistory } from 'react-router-dom'

import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { validateDate, validateTime } from '../util/helpers'
import { UserContext } from '../App'
import { useToasts } from '../components/Toast'
import DateFormatted from '../components/DateFormatted'
import RotateScreenModal from '../components/RotateScreenModal'
import moment from 'moment'
import AppointmentCard from '../components/calendar/AppointmentCard'
import NowIndicatorContent from '../components/calendar/NowIndicatorContent'
import ListboxColor from '../components/ListboxColor'
import { OrganizationContext } from '../contexts/Organizations/organizationSelectedContext'
import { AllOrganizationContext } from '../contexts/Organizations/organizationsContext'
import { usePrescriptionContext } from '../contexts/Prescriptions/PrescriptionContext';
import handleSendSentry from '../util/Sentry/sentryHelper'
import { ERROR_HEADERS } from '../util/Sentry/errorHeaders'

type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

const privateEventDataTransform = (event) => {

  return {
    title: `${event.name}`,
    start: `${event.start}`,
    end: `${event.end}`,
    classNames: ['event-other', 'boldo-event'],
    extendedProps: {...event, type: 'PrivateEvent'},
  }  

}

const appointmentDataTransform = (event) => {

  const getColorClass = (eventType) => {
    if (eventType === 'VIRTUAL') return 'event-online'
    if (eventType === 'ONSITE') return 'event-inperson'
    return 'event-other'
  }

  return {
    title: `${event?.patient?.first_name} ${event?.patient?.last_name}`,
    start: `${event.date} ${event.start_time}`,
    end: `${event.date} ${event.end_time}`,
    classNames: [getColorClass(event.type), 'boldo-event'],
    extendedProps: event,
  }

}

type AppointmentForm = Omit<Boldo.Appointment, 'start' | 'end' | 'patientId' | 'doctorId'> & {
  start: string
  end: string
  date: string
  appointmentType: string
}

const initialAppointment = {
  id: 'new',
  name: '',
  start: '',
  end: '',
  date: '',
  description: '',
  type: 'PrivateEvent',
  appointmentType: ''
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

export default function Dashboard() {
  
  const history = useHistory()
  const { addToast, addErrorToast } = useToasts()

  const [appointments, setAppointments] = useState([]);
  const [privateEvents, setPrivateEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const [appointment, dispatch] = useReducer(reducer, initialAppointment);

  const calendar = useRef<FullCalendar>(null);

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loadingAppointment, setLoadingAppointment] = useState(false)

  const { user } = useContext(UserContext)
  const newUser = user.new;

  const [openHours, setOpenHours] = useState(undefined as Boldo.OpenHours)
  const [isOpen, setIsOpen] = useState(false);


  const { Organization, setOrganization } = useContext(OrganizationContext);
  const { Organizations } = useContext(AllOrganizationContext);

  const loadingAppoimentRef = useRef<HTMLDivElement>()

  const { updatePrescriptions } = usePrescriptionContext();

  useEffect(() => {
    // console.log("blocks: ", user.blocks)
    // console.log("org: ", Organization)
    if (Organization) {
      let bloc = user.blocks.find((bloc) => bloc.idOrganization === Organization.id)
      // console.log("bloc: ", bloc)
      if (bloc) setOpenHours(bloc.openHours)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Organization])

  useEffect(() => {
    const showOrNotToast = () => {
      if (Organizations === undefined) {
        addToast({ type: 'warning', title: "Ocurrió un error inesperado.", text: 'No se pudieron obtener los centros asistenciales.' })
      } 
      else if (Organizations?.length === 0) {
        addToast({ type: 'info', text: 'No posee centros asistenciales. Contacte con el equipo de soporte.' })
      }
    }
    if (Organizations !== null) showOrNotToast()
  }, [])

  useEffect(() => {
    if (window.innerHeight > window.innerWidth) {
      setIsOpen(true);
    }
  }, 
  []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if(Organization){
        loadEvents();
      }
    }, 
    10000)
    return () => clearInterval(timer)
  });

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
      setError('¡Fecha inválida!')
    }

    // Validate Time. Because Safari does not have time input
    if (!validateTime(appointment.start) || !validateTime(appointment.end)) {
      validationError = true
      setError('¡Inicio o final inválido!')
    }

    if (validationError) return setLoading(false)

    const url = `https://dev-doctors.boldo.pti.org.py/doctors/private-events`
    try {
      if (!Organization) {
        addToast({
          type: 'error',
          title: 'Error',
          text: 'No se pudo obtener la organización al que pertenece.',
        })
        setShowEditModal(false)
        return
      }

      const payload = {
        name: appointment.name,
        description: appointment.description,
        date: `${appointment.date}`,
        start: `${appointment.date} ${appointment.start}:00.000`,
        end: `${appointment.date} ${appointment.end}:00.000`,
        organization_id: Organization.id
      }

      console.log(payload);

      const res = await axios.post(url, payload) // <Boldo.Appointment>
      // setAppointmentsAndReload(appointments => [eventDataTransform(res.data), ...appointments]) 
      loadEvents();

      setShowEditModal(false)
      dispatch({ type: 'reset' })
      addToast({
        type: 'success',
        title: 'Evento privado',
        text: '¡Se ha creado el evento privado con éxito!',
      })
    } catch (err) {
      const tags = {
        "endpoint": url,
        "method": "POST"
      }
      handleSendSentry(err, ERROR_HEADERS.PRIVATE_EVENTS.FAILURE_CREATE, tags)
      addToast({ type: 'error', title: 'Ha ocurrido un error.', text: 'No fue posible crear el evento privado. ¡Inténtelo nuevamente más tarde!' })
    }

    setLoading(false)
  }

  const loadEvents = async () => {
    if(Organization && calendar.current){
      const api = calendar.current.getApi();
      const start = api.view.activeStart.toISOString().split('T')[0];
      const end = api.view.activeEnd.toISOString().split('T')[0];
      
      setLoadingAppointment(true);
      
      await loadAppointments(start, end, Organization.id);
      await loadPrivateEvents(start, end, Organization.id); 
  
      setLoadingAppointment(false);
    }
  }

  const loadAppointments = async (start, end, organizationId) => {
    const url = `https://dev-doctors.boldo.pti.org.py/doctors/appointments?start=${start}&end=${end}&organization_id=${organizationId}`
    await axios.get(url).
    then(res => {
      setAppointments(res.status == 200 ? res.data : []);
    }).
    catch(err => {
      console.log(err);
      setAppointments([]);
    })
  }

  const loadPrivateEvents = async (start, end, organizationId) => {
    const url = `https://dev-doctors.boldo.pti.org.py/doctors/private-events?start=${start}&end=${end}&organization_id=${organizationId}`
    await axios.get(url).
    then(res => {
      setPrivateEvents(res.status == 200 ? res.data : []);
    }).
    catch(err => {
      console.log(err);
      setPrivateEvents([]);
    })
  }

  useEffect(() => {
    if(Organization){
      loadEvents();
    }
  },
  [Organization]);

  useEffect(() => {
    let aEvents = appointments.map(event => appointmentDataTransform(event));
    let pEvents = privateEvents.map(event => privateEventDataTransform(event));
    setEvents([...aEvents, ...pEvents])
  }, 
  [privateEvents, appointments]);  

  useEffect(() => {
    const api = calendar.current.getApi();
    api.removeAllEvents()
    api.addEventSource([...events]);
  }, 
  [events]);

  const handleDates = (dates) => {
      console.log("change date", dates);
      if(Organization){
        loadEvents();
      }
  }

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.stopPropagation()
    if (info.event.display === 'background') return
    if (info.event.extendedProps.type === 'Appointment')
      setSelectedAppointment(info.event.extendedProps as AppointmentWithPatient)
    if (info.event.extendedProps.status === 'CANCELLED') {

    } 
    else if (info.event.extendedProps.type === 'PrivateEvent') {
      setSelectedAppointment(info.event.extendedProps as AppointmentWithPatient)
    } 
    else
      if (info.event.extendedProps.type === 'VIRTUAL' && info.event.extendedProps.status !== 'LOCKED') {
        return history.push(`/appointments/${info.event.extendedProps.id}/call`)
      } 
      else {
        return history.push(`/appointments/${info.event.extendedProps.id}/inperson`)
      }
  }

  const openHoursEmpty = useMemo(() => {
    if (!openHours) return false

    return (
      (Object.keys(openHours) as Array<keyof typeof openHours>)
        .map(x => openHours[x].length)
        .reduce((a, b) => a + b) === 0
    )
  }, [openHours])

  useEffect(() => {
    updatePrescriptions("", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Layout>
        {newUser ? (
          <div className='flex flex-col h-full md:flex-row'>
            <div className='flex items-center justify-center flex-grow'>
              <div className='max-w-sm m-4'>
                <img className='w-full h-full rounded' src='/img/welcome.svg' alt='Welcome' />
                <div className='mt-3 text-center sm:mt-5'>
                  <h3 className='text-2xl font-medium leading-6 text-gray-900' id='modal-headline'>
                    ¡Bienvenido!
                  </h3>
                  <div className='mt-2'>
                    <p className='text-gray-700'>
                      Recuerda completar tu perfil, especialmente tu información profesional para que tu cuenta sea
                      validada y puedas utilizar la plataforma.
                      <br /> Por favor, añada idioma, especialidad y horario de apertura.
                    </p>
                  </div>
                  <div className='my-6'>
                    <span className='rounded-md shadow-sm '>
                      <Link
                        to='/settings'
                        className='inline-flex justify-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700 sm:text-sm sm:leading-5'
                      >
                        Configurar Perfil
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='flex flex-col h-full text-cool-gray-700 overflow-x-auto' style={{ minWidth: '1200px' }}>
              {openHoursEmpty && (
                <div className='relative' style={{ backgroundColor: Organization?.colorCode ? Organization.colorCode : '#27BEC2' }}>
                  <div className='px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='pr-16 sm:text-center sm:px-16'>
                      <p className='font-medium text-white'>
                        { Organization && <span>Aún no tienes configurado el horario de apertura en {Organization.name}.</span> }
                        <span className='block sm:ml-2 sm:inline-block'>
                          <Link to='/settings' className='font-bold text-white underline'>
                            {' '}
                            Añade horarios de apertura <span aria-hidden='true'>→</span>
                          </Link>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex items-center px-4 py-2 sm:px-6 lg:px-8'>
                <div className='flex-1 min-w-0'>
                  <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>Mi Horario</h1>
                </div>
                <div className='w-80'>
                  {Organizations?.length > 0 &&
                    <ListboxColor data={Organizations}
                      id={Organization?.id || Organizations[0].id}
                      label='Espacio de Trabajo'
                      onChange={value => {
                        setOrganization(Organizations.find((d) => d.id === value))
                        Sentry.setTag('organization_current', Organizations.find((d) => d.id === value).name ?? '')
                        loadEvents()
                      }}>
                    </ListboxColor>
                  }
                </div>
                <div className='flex mt-4 md:mt-0 md:ml-4'>
                  <span className='pt-5 ml-3 rounded-md shadow-sm'>
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
                      Agregar evento
                    </button>
                  </span>
                </div>
              </div>
              {/* this is the container of the appointment loading */}
              <div ref={loadingAppoimentRef} className={`${loadingAppointment ? `flex` : `hidden`} w-full h-full justify-items-center align-middle z-50 fixed left-20 top-20`}>
                <div className='m-auto flex-col justify-items-center align-middle'>
                  {/* this is the spinner */}
                  <div className='loader ml-8'></div>
                  <p>Cargando citas...</p>
                </div>
              </div>
              <FullCalendar
                ref={calendar}
                events={events}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => AppointmentCard(eventInfo, Organization?.colorCode)}
                // we define it in tailwind.css
                // eventBackgroundColor={'#FFFFFF'}
                eventBorderColor={'#e5e7eb'}
                eventTextColor={'#000000'}
                height='100%'
                stickyHeaderDates={true}
                slotDuration={'00:15:00'}
                slotLabelInterval={'00:30'}
                plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
                initialView='timeGridWeek'
                nowIndicator={true}
                nowIndicatorContent={NowIndicatorContent}
                datesSet={handleDates}
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
                    buttonText: '3 Dias',
                  },
                }}
                expandRows={true}
                allDaySlot={false}
                slotLabelFormat={{ hour: '2-digit', minute: '2-digit' }}
                scrollTime={moment().format('HH:00:00')}
              />
            </div>
          </>
        )}
      </Layout>
      <>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
          }} >

          <RotateScreenModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </>
      <Modal show={showEditModal} setShow={setShowEditModal} size='xl' noPadding>
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
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
                  Evento Privado
                </h3>
                <div className='mt-2'>
                  <p className='text-sm leading-5 text-gray-500'>
                    Agrega un nuevo evento. Este evento solo es visible para ti. Bloqueará a los pacientes para que no
                    reserven en este intervalo de tiempo.
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
                        Inicio
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
                        Fin
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
          callback={() => { loadEvents(); }}
        />
      )}
    </>
  )
}

interface EventModalProps {
  setShow: (arg: boolean) => void
  appointment: AppointmentWithPatient
  callback: () => void
}

const EventModal = ({ setShow, appointment, callback }: EventModalProps) => {

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const { addToast } = useToasts()


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
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return
    setLoading(true)
    setError('')
    const url = `https://dev-doctors.boldo.pti.org.py/doctors/private-events/${id}`
    try {
      await axios.delete(url)
      callback();
      setLoading(false)
      setShow(false)
    } 
    catch (err) {
      const tags = {
        "endpoint": url,
        "method": "DELETE",
        "appointment_id": `${id}`
      }
      handleSendSentry(err, ERROR_HEADERS.PRIVATE_EVENTS.FAILURE_DELETE, tags)
      setLoading(false)
      addToast({ type: 'error', title: 'Ha ocurrido un error.', text: 'No se pudo eliminar el evento privado. Vuelva a intentarlo más tarde.' })
      console.log(err)
    }
  }

  return (
    <Modal show={true} setShow={setShow} size='xl' noPadding>
      <div>
        <div className='divide-y divide-gray-200'>
          <div className='pb-6'>
            <div className='h-24 gradient-primary sm:h-20 lg:h-28' />
            <div
              className={`flow-root px-4 space-y-6 sm:flex sm:items-end sm:px-6 sm:space-x-6 ${hasPicture ? '-mt-12 lg:-mt-15 sm:-mt-8' : ''
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
                      {appointment.name || `${appointment.patient.givenName} ${appointment.patient.familyName}`}
                    </h3>
                  </div>
                  <p className='space-x-2 text-sm leading-5 text-gray-500'>
                    <DateFormatted start={appointment.start} end={appointment.end} />
                  </p>
                </div>
                {/* {status === 'open' &&  (
                  // <div className='flex flex-wrap'>
                  //   <span className='inline-flex flex-shrink-0 w-full rounded-md shadow-sm sm:flex-1'>
                  //     <Link
                  //       to={`/appointments/${appointment.id}/call`}
                  //       className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700'
                  //     >
                  //       Start Call
                  //     </Link>
                  //   </span>
                  // </div>
                )} */}
              </div>
            </div>
          </div>
          <div className='px-4 py-5 sm:px-0 sm:py-0'>
            <dl className='space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200'>
              {appointment.description && (
                <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                  <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>
                    Descripción
                  </dt>
                  <dd className='mt-1 overflow-auto text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                    <p className='break-words'>{appointment.description}</p>
                  </dd>
                </div>
              )}
              <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>Tipo</dt>
                <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>
                  {
                    appointment.appointmentType === 'E'
                      ? 'Evento privado'
                      : appointment.appointmentType === 'V'
                        ? 'Consulta virtual'
                        : 'Consulta Presencial'
                  }
                </dd>
              </div>
              {status && (
                <div className='sm:flex sm:space-x-6 sm:px-6 sm:py-5'>
                  <dt className='text-sm font-medium leading-5 text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48'>
                    Estado
                  </dt>
                  <dd className='mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2'>{appointment.status === 'cancelled' && 'Cancelado'}</dd>
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
              Cerrar
            </button>
          </span>
          <p></p>
        </div>
      </div>
    </Modal>
  )
}
