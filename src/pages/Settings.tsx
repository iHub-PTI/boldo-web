import React, { useState, useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import Layout from '../components/Layout'
import Listbox from '../components/Listbox'
import MultiListbox from '../components/MultiListbox'
import Languages from '../util/ISO639-1-es.json'
import { daysFromMessage, organizationsFromMessage, validateDate, validateOpenHours } from '../util/helpers'
import { UserContext } from '../App'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import MultiSelect from '../components/MultiSelect'
import * as Sentry from '@sentry/react'
// Uncomment if necessary
// import { OrganizationContext } from '../contexts/Organizations/organizationSelectedContext'
import { AllOrganizationContext } from '../contexts/Organizations/organizationsContext'
// import { doctorData } from '../components/LoadAppointments'
import { useToasts } from '../components/Toast'
import { ReactComponent as ArrowDown } from '../assets/keyboard-arrow-down.svg'
import { ReactComponent as ArrowUp } from '../assets/keyboard-arrow-up.svg'
import imageCompression from 'browser-image-compression'
import handleSendSentry from '../util/Sentry/sentryHelper'
import { ERROR_HEADERS } from '../util/Sentry/errorHeaders'

// export const fileTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/webp']
export const fileTypes = ['image/jpeg', 'image/png']

export function validFileType(file: string) {
  return fileTypes.includes(file)
}

export const upload = async (file: File | string) => {
  if (!file) return
  if (typeof file === 'string') return file

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    const res = await axios.get('/presigned')
    const ress = await axios({
      method: 'put',
      url: `${res.data.uploadUrl}&x-amz-acl=public-read`,
      data: compressedFile,
      withCredentials: false,
      headers: { 'Content-Type': compressedFile.type, authentication: null },
    })
    if (ress.status === 201) return res.data.location
  } catch (err) {
    handleSendSentry(err, ERROR_HEADERS.SETTINGS.FAILURE_PUT_PHOTO)
    // console.log(err)
  }
}

interface Interval {
  start: number
  end: number
  appointmentType: string
}

type weekDay = keyof typeof weekDays
const weekDays = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
}

type DoctorForm = Omit<Boldo.Doctor, 'photoUrl' | 'id' | 'new'> & { photoUrl?: Boldo.Doctor['photoUrl'] | File | null }

const initialState: DoctorForm = {
  photoUrl: '',
  givenName: '',
  familyName: '',
  languages: [],
  biography: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  neighborhood: '',
  addressDescription: '',
  specializations: [],
  license: '',
  blocks: [] as Array<Boldo.Block>,
}

const initialBlock = {
  openHours: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
  idOrganization: '',
} as Boldo.Block

const errorTitle = 'Error al enviar el formulario.'
const errorSend = 'No se pudo enviar el formulario.'
const errorUnknown = 'Ocurrió un error inesperado.'

const errorText = {
  birthday: '¡Añada una fecha de nacimiento correcta!',
  language: '¡Añada al menos un idioma!',
  specialization: '¡Añada al menos una especialización!',
  gender: '¡Seleccione un género!',
  openHours: '¡Ingrese un horario con finalización mayor al inicio',
  photo: 'Ha ocurrido un error con las imágenes! Intente de nuevo.',
  organizations: 'Debe tener asociado al menos un centro asistencial. Contáctese con soporte para ello.',
  unknown: 'No pudimos obtener centros asistenciales asociados a su cuenta. Por favor, inténtelo nuevamente más tarde.',
}

type Action =
  | { type: 'initial'; value: DoctorForm; organizations: Array<Boldo.Organization> }
  | { type: 'default'; value: Partial<DoctorForm> }
  | { type: 'AddOpenHour'; value: { day: weekDay }; org: string }
  | { type: 'RemoveOpenHour'; value: { day: weekDay; index: number }; org: string }
  | { type: 'ChangeOpenHour'; value: { day: weekDay; index: number; interval: Interval }; org: string }

function reducer(state: DoctorForm, action: Action): DoctorForm {
  switch (action.type) {
    case 'initial': {
      const auxDoctor = action.value
      if (action.organizations?.length > 0) {
        if (action.value.blocks.length === 0) {
          for (let index = 0; index < action.organizations.length; index++) {
            // here we add the id of the organization
            // and now we add the block to the doctor form
            auxDoctor.blocks.push({ ...initialBlock, idOrganization: action.organizations[index].id })
          }
        } else {
          for (let indexOrg = 0; indexOrg < action.organizations.length; indexOrg++) {
            let exist = false
            for (let index = 0; index < action.value.blocks.length; index++) {
              if (action.organizations[indexOrg].id === action.value.blocks[index].idOrganization) {
                exist = true
                break
              }
            }
            if (!exist) {
              const auxBlock = {
                openHours: {
                  mon: [],
                  tue: [],
                  wed: [],
                  thu: [],
                  fri: [],
                  sat: [],
                  sun: [],
                },
                idOrganization: '',
              } as Boldo.Block
              // here we add the id of the organization
              auxBlock.idOrganization = action.organizations[indexOrg].id
              // and now we add the block to the doctor form
              auxDoctor.blocks.push(auxBlock)
            }
          }
        }
      }
      return auxDoctor
    }

    case 'default':
      return { ...state, ...action.value }

    case 'AddOpenHour': {
      let idOrganization = action.org
      // console.log("idOrganization => ", idOrganization)
      // we search the bloc organization
      const block = state.blocks.find(bloc => bloc.idOrganization === idOrganization)

      //const day = [...state.openHours[action.value.day], { start: 0, end: 0 }]
      const day = [...block.openHours[action.value.day], { start: 0, end: 0 }]

      //const openHours = { ...state.openHours, [action.value.day]: day }
      const openHours = { ...block.openHours, [action.value.day]: day }
      // will always be an array of length one
      const newBlock = [{ openHours, idOrganization }] as Array<Boldo.Block>
      // we replace the block that matches the idOrganization
      for (let index = 0; index < state.blocks.length; index++) {
        if (state.blocks[index].idOrganization === idOrganization) {
          state.blocks[index] = newBlock[0]
        }
      }

      //return { ...state, openHours }
      return { ...state }
    }

    case 'RemoveOpenHour': {
      let idOrganization = action.org
      // console.log("idOrganization => ", idOrganization)
      // we search the bloc organization
      const block = state.blocks.find(bloc => bloc.idOrganization === idOrganization)
      const day = block.openHours[action.value.day].filter((_, i) => i !== action.value.index)
      //const openHours = { ...state.openHours, [action.value.day]: day }
      const openHours = { ...block.openHours, [action.value.day]: day }
      // will always be an array of length one
      const newBlock = [{ openHours, idOrganization }] as Array<Boldo.Block>
      // we replace the block that matches the idOrganization
      for (let index = 0; index < state.blocks.length; index++) {
        if (state.blocks[index].idOrganization === idOrganization) {
          state.blocks[index] = newBlock[0]
        }
      }
      //return { ...state, openHours }
      return { ...state }
    }

    case 'ChangeOpenHour': {
      let idOrganization = action.org
      // console.log("idOrganization => ", idOrganization)
      const block = state.blocks.find(bloc => bloc.idOrganization === idOrganization)

      const day = block.openHours[action.value.day].map((interval, i) =>
        i === action.value.index ? action.value.interval : interval
      )

      const openHours = { ...block.openHours, [action.value.day]: day }
      // console.log("openHours => ", openHours)
      // will always be an array of length one
      const newBlock = [{ openHours, idOrganization }] as Array<Boldo.Block>
      // console.log("newBlock => ", newBlock)
      // we replace the block that matches the idOrganization
      for (let index = 0; index < state.blocks.length; index++) {
        if (state.blocks[index].idOrganization === idOrganization) {
          state.blocks[index] = newBlock[0]
        }
      }
      //return { ...state, openHours }
      return { ...state }
    }

    default:
      throw new Error()
  }
}

type List = { value: string; name: string }[]

interface Props {}

const Settings = (props: Props) => {
  let history = useHistory()

  const [doctor, dispatch] = useReducer(reducer, initialState)
  const [specializations, setSpecializations] = useState<List>([])

  const [error, setError] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const { updateUser } = useContext(UserContext)
  // Uncomment if necessary
  // const { Organization } = useContext(OrganizationContext)
  const { Organizations } = useContext(AllOrganizationContext)

  const { addToast } = useToasts()

  const errorMsg = {
    overlay: 'openHours settings overlay',
    overlayTypes: 'openHours setting overlay between appointment types',
  }

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await axios.get('/profile/doctor') // used to be <Boldo.Doctor | null>
        const res2 = await axios.get<iHub.Specialization[]>('/specializations')

        if (mounted) {
          if (res.data) {
            const doctor = {
              ...res.data,
              languages: res.data.languages.map((l: any) => l.id),
              specializations: res.data.specializations.map((l: any) => l.id),
            }
            dispatch({ type: 'initial', value: doctor, organizations: Organizations })
          }
          const specializations = res2.data.map(spec => {
            return { value: spec.id.toString(), name: spec.description }
          })
          setSpecializations(specializations)
          setShow(true)
        }
      } catch (err) {
        // console.log(err)
        handleSendSentry(err, 'Could not get the doctor profile with the specializations')
        if (mounted) {
          addToast({ type: 'error', title: 'Ha ocurrido un error.', text: 'Falló la carga inicial de los datos.' })
          setShow(true)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    let validationError = false

    // the most important thing is that there is an associated organization
    if (Organizations === undefined || Organizations === null) {
      validationError = true
      addToast({ type: 'warning', title: errorUnknown, text: errorText.unknown })
    } else if (Organizations.length > 0) {
      if (!validateDate(doctor.birthDate, 'past')) {
        validationError = true
        addToast({ type: 'warning', title: errorTitle, text: errorText.birthday })
      }

      if (doctor.languages.length === 0) {
        validationError = true
        addToast({ type: 'warning', title: errorTitle, text: errorText.language })
      }

      if (doctor.specializations.length === 0) {
        validationError = true
        addToast({ type: 'warning', title: errorTitle, text: errorText.specialization })
      }

      if (doctor.gender === 'unknown') {
        validationError = true
        addToast({ type: 'warning', title: errorTitle, text: errorText.gender })
      }

      doctor.blocks.forEach(block => {
        if (!validateOpenHours(block.openHours)) {
          validationError = true
          const customOpenHoursError =
            errorText.openHours + ` en ${Organizations.find(element => element.id === block.idOrganization).name}!`
          addToast({ type: 'warning', title: errorTitle, text: customOpenHoursError })
        }
      })

      if (!validationError) {
        const url = '/profile/doctor'
        try {
          let photoUrl = doctor.photoUrl
          if (doctor.photoUrl) {
            photoUrl = await upload(doctor.photoUrl)

            if (!photoUrl) return addToast({ type: 'warning', title: errorTitle, text: errorText.photo })
            dispatch({ type: 'default', value: { photoUrl } })
          }

          await axios.put(url, { ...doctor, photoUrl })
          // setSuccess('Actualización exitosa!')
          addToast({
            type: 'success',
            title: '¡Actualización exitosa!',
            text: 'La información de su perfil ha sido actualizada.',
          })
          updateUser({
            ...(typeof photoUrl === 'string' && { photoUrl }),
            givenName: doctor.givenName,
            familyName: doctor.familyName,
            blocks: doctor.blocks,
            new: false,
          })
        } catch (err) {
          // Sentry.captureException(err)
          // setError(err.response?.data.message || 'Ha ocurrido un error! Intente de nuevo.')
          // console.log(err)
          Sentry.setTags({
            endpoint: url,
            method: 'PUT',
          })
          if (err.response) {
            // The response was made and the server responded with a
            // status code that is outside the 2xx range.
            Sentry.setTags({
              data: err.response.data,
              headers: err.response.headers,
              status_code: err.response.status,
            })
            if (err.response.status === 400) {
              if (err.response.data.message.includes(errorMsg.overlay)) {
                let overlay = organizationsFromMessage(err.response.data.message, Organizations)
                addToast({
                  type: 'warning',
                  title: 'Hubo un error en el formulario.',
                  text:
                    overlay.length > 0
                      ? `Existen horarios solapados entre ${overlay[0]} y ${overlay[1]}.`
                      : 'Existen horarios solapados que impiden la actualización.',
                })
              } else if (err.response.data.message.includes(errorMsg.overlayTypes)) {
                let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
                let orgOverlay = organizationsFromMessage(err.response.data.message, Organizations)
                let dayOverlay = daysFromMessage(err.response.data.message, days)

                addToast({
                  type: 'warning',
                  title: 'Hubo un error en el formulario.',
                  text:
                    orgOverlay.length > 0 && dayOverlay.length > 0
                      ? `Existen horarios solapados el día ${dayOverlay[0]} en la organización ${orgOverlay[0]}`
                      : 'Existen horarios solapados que impiden la actualización.',
                })
              }
            } else {
              addToast({
                type: 'warning',
                title: 'Hubo un error en el formulario.',
                text: 'No se pudo actualizar el perfil.',
              })
            }
          } else if (err.request) {
            // The request was made but no response was received
            Sentry.setTag('request', err.request)
            addToast({
              type: 'error',
              title: 'Hubo un error en el servidor.',
              text: 'No se recibió ninguna respuesta. ¡Inténtelo nuevamente más tarde!',
            })
          } else {
            // Something happened while preparing the request that threw an Error
            Sentry.setTag('message', err.message)
            addToast({
              type: 'error',
              title: 'Ocurrió un error inesperado.',
              text: '¡Inténtelo nuevamente más tarde!',
            })
          }
          Sentry.captureMessage('Could not update doctor profile')
          Sentry.captureException(err)
        }
      }
    } else {
      validationError = true
      addToast({ type: 'warning', title: errorSend, text: errorText.organizations })
    }
    setLoading(false)
  }

  const getOrganizationNameById = (idOrganization: String) => {
    return Organizations.find(organization => organization.id === idOrganization).name
  }
  const getOrganizationById = (idOrganization: String) => {
    if(!idOrganization) throw new Error('No ha ingresado un id')
    return Organizations.find(organization => organization.id === idOrganization)
  }

  return (
    <Layout isLoading={!show}>
      <div className='w-full min-h-screen py-6 bg-gray-100 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          <form onSubmit={e => handleSubmit(e)}>
            <div className='px-4 pb-5 space-y-3 border-b border-gray-200 sm:flex sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0 sm:px-0'>
              <h3 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate'>
                Mi cuenta
              </h3>
              {/* prevent show submit buttom on top of the screen */}
              {/* <div className='flex flex-col-reverse items-center sm:flex-row'>
                {error && <span className='mt-2 text-sm text-red-600 sm:mt-0 sm:mr-2'>{error}</span>}
                {success && <span className='mt-2 text-sm text-green-600 sm:mt-0 sm:mr-2'>{success}</span>}
                <span className='flex w-full rounded-md shadow-sm sm:w-auto'>
                  <button
                    type='submit'
                    className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700 sm:text-sm sm:leading-5'
                    disabled={loading}
                  >
                    {loading && (
                      <svg
                        className='w-5 h-5 mr-3 -ml-1 text-white animate-spin'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
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
                    Guardar
                  </button>
                </span>
              </div> */}
            </div>
            <div className='mt-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <div className='px-4 sm:px-0'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Perfil</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>Esta información se mostrará públicamente.</p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='px-4 py-5 bg-white sm:p-6'>
                      <div className=''>
                        <label className='block text-sm font-medium leading-5 text-gray-700'>Foto</label>
                        <p className='mt-2 text-sm text-gray-500'>
                          Sube una foto de perfil. Para una mejor calidad, elige una foto cuadrada de 512 px.
                        </p>
                        <div className='flex items-center mt-2'>
                          <span className='inline-block w-12 h-12 overflow-hidden bg-gray-100 rounded-full'>
                            {!doctor.photoUrl ? (
                              <svg className='w-full h-full text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                              </svg>
                            ) : (
                              <img
                                src={
                                  typeof doctor.photoUrl === 'object'
                                    ? URL.createObjectURL(doctor.photoUrl)
                                    : doctor.photoUrl
                                }
                                alt='Restaurant Banner Preview'
                                className='object-cover w-full h-full max-w-none'
                              />
                            )}
                          </span>
                          <span className='ml-5'>
                            <label
                              htmlFor='photoUrl'
                              className='px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md cursor-pointer hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800'
                            >
                              Cambiar
                            </label>
                            <input
                              type='file'
                              accept='image/x-png,image/webp,image/jpeg,image/pjpeg,image/gif'
                              id='photoUrl'
                              name='photoUrl'
                              className='hidden w-0'
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (!file || !validFileType(file.type)) return

                                dispatch({ type: 'default', value: { photoUrl: file } })
                              }}
                            />
                          </span>
                        </div>
                      </div>
                      <div className='grid grid-cols-6 gap-6 mt-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='givenName' className='block text-sm font-medium leading-5 text-gray-700'>
                            Nombre
                          </label>
                          <input
                            id='givenName'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { givenName: e.target.value } })}
                            value={doctor.givenName}
                            required
                            type='text'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='familyName' className='block text-sm font-medium leading-5 text-gray-700'>
                            Apellido
                          </label>
                          <input
                            id='familyName'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { familyName: e.target.value } })}
                            value={doctor.familyName}
                            required
                            type='text'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='birthDate' className='block text-sm font-medium leading-5 text-gray-700'>
                            Fecha de nacimiento
                          </label>
                          <input
                            id='birthDate'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { birthDate: e.target.value } })}
                            value={doctor.birthDate}
                            required
                            type='date'
                            placeholder='yyyy-mm-dd'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <Listbox
                            data={[
                              { value: 'male', name: 'Masculino' },
                              { value: 'female', name: 'Femenino' },
                              { value: 'other', name: 'Otro' },
                              ...(doctor.gender === 'unknown'
                                ? [{ value: 'unknown', name: 'Por favor seleccione un género' }]
                                : []),
                            ]}
                            label='Género'
                            value={doctor.gender}
                            onChange={value => dispatch({ type: 'default', value: { gender: value } })}
                          />
                        </div>
                      </div>
                      <div className='mt-6'>
                        <div className='grid grid-cols-6 gap-6 mt-6'>
                          <div className='col-span-6 sm:col-span-4'>
                            <MultiListbox
                              data={Languages}
                              drawLine={[3]}
                              label='Idiomas'
                              value={doctor.languages}
                              onChange={value => dispatch({ type: 'default', value: { languages: value } })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='mt-6'>
                        <label htmlFor='biography' className='block text-sm font-medium leading-5 text-gray-700'>
                          Mi biografía
                        </label>
                        <p className='mt-1 text-sm text-gray-500'>
                          Agrega una breve biografía para que los pacientes sepan más sobre tí.
                        </p>
                        <div className='rounded-md shadow-sm'>
                          <textarea
                            id='biography'
                            rows={3}
                            className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5'
                            placeholder='Recibido en la Universidad Nacional de Asunción con especialización en Dermatología Pediátrica. Miembro de la asiciocion DERLA hace 6 años.'
                            onChange={e => dispatch({ type: 'default', value: { biography: e.target.value } })}
                            value={doctor.biography}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} loading={loading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden sm:block'>
              <div className='py-5'>
                <div className='border-t border-gray-200' />
              </div>
            </div>
            <div className='mt-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <div className='px-4 sm:px-0'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Datos de Contacto</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>Esta información se mostrará públicamente.</p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='px-4 py-5 bg-white sm:p-6'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='email' className='block text-sm font-medium leading-5 text-gray-700'>
                            Correo Electrónico
                          </label>
                          <input
                            id='email'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { email: e.target.value } })}
                            value={doctor.email}
                            required
                            type='email'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='phone' className='block text-sm font-medium leading-5 text-gray-700'>
                            Teléfono
                          </label>
                          <input
                            id='phone'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { phone: e.target.value } })}
                            value={doctor.phone}
                            type='tel'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='street' className='block text-sm font-medium leading-5 text-gray-700'>
                            Calle
                          </label>
                          <input
                            id='street'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { street: e.target.value } })}
                            value={doctor.street}
                            type='text'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='neighborhood' className='block text-sm font-medium leading-5 text-gray-700'>
                            Barrio
                          </label>
                          <input
                            id='neighborhood'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { neighborhood: e.target.value } })}
                            value={doctor.neighborhood}
                            type='text'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='city' className='block text-sm font-medium leading-5 text-gray-700'>
                            Ciudad
                          </label>
                          <input
                            id='city'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { city: e.target.value } })}
                            value={doctor.city}
                            type='text'
                          />
                        </div>
                        <div className='col-span-6'>
                          <label
                            htmlFor='addressDescription'
                            className='block text-sm font-medium leading-5 text-gray-700'
                          >
                            Referencia
                          </label>

                          <p className='mt-1 text-sm text-gray-500'>
                            Color de casa, número de casa o algún lugar de referencia.
                          </p>
                          <input
                            id='addressDescription'
                            className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
                            onChange={e => dispatch({ type: 'default', value: { addressDescription: e.target.value } })}
                            value={doctor.addressDescription}
                            type='text'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} loading={loading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='hidden sm:block'>
              <div className='py-5'>
                <div className='border-t border-gray-200' />
              </div>
            </div>
            <div className='mt-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <div className='px-4 sm:px-0'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Profesional</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>Esta información se mostrará públicamente.</p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='px-4 py-5 bg-white sm:p-6'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 mb-40 sm:col-span-3'>
                          <MultiSelect
                            data={specializations}
                            label='Especialidad Médica'
                            value={doctor.specializations}
                            onChange={value => dispatch({ type: 'default', value: { specializations: value } })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} loading={loading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='hidden sm:block'>
              <div className='py-5'>
                <div className='border-t border-gray-200' />
              </div>
            </div>

            <div className='mt-10 sm:mt-0'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <div className='px-4 sm:px-0'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Horario de apertura</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>
                      Configura cuándo los clientes pueden reservar citas a través de la aplicación.
                    </p>
                  </div>
                </div>
                {Organizations === undefined || Organizations === null ? (
                  <div className='mt-5 md:mt-0 md:col-span-2 bg-white shadow sm:rounded-md sm:overflow-hidden'>
                    <p className='p-5 text-sm font-medium leading-5 text-gray-700'>
                      No pudimos obtener centros asistenciales asociados a su cuenta, por favor, vuelva a intentarlo más
                      tarde. Si el problema persiste, contáctese con soporte.
                    </p>
                  </div>
                ) : Organizations?.length === 0 ? (
                  <div className='mt-5 md:mt-0 md:col-span-2 bg-white shadow sm:rounded-md sm:overflow-hidden'>
                    <p className='p-5 text-sm font-medium leading-5 text-gray-700'>
                      No posee ningún centro asistencial asociado. Por favor, contáctese con soporte para dicha gestión.
                    </p>
                  </div>
                ) : (
                  <div className='bg-white mt-5 md:mt-0 md:col-span-2 shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='overflow-hidden shadow sm:rounded-md'>
                      {doctor.blocks.map((block, indexOrg) => {
                        return (
                          <div className='w-full px-2 pt-4' key={indexOrg}>
                            <div className='mx-auto w-full rounded-2xl p-2'>
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className='flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-teal-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                                      <div className='flex flex-row align-middle'>
                                        <div
                                          className='h-6 w-2'
                                          style={{ backgroundColor: getOrganizationById(block.idOrganization)?.colorCode ?? '#27BEC2' }}
                                        ></div>
                                        <span className='pl-2'>{getOrganizationNameById(block.idOrganization)}</span>
                                      </div>
                                      <div className='pt-2 align-bottom'>{open ? <ArrowUp /> : <ArrowDown />}</div>
                                    </Disclosure.Button>
                                    <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                                      <div className=' bg-white sm:p-6'>
                                        {(Object.keys(weekDays) as Array<keyof typeof weekDays>).map(day => (
                                          <fieldset key={day}>
                                            <div className='flex items-center mb-3'>
                                              <legend className='font-medium leading-5 text-gray-700 '>
                                                {weekDays[day]}
                                              </legend>
                                              <button
                                                className='flex items-center justify-center w-8 h-8 ml-1 rounded-full focus:outline-none focus:bg-cool-gray-100'
                                                onClick={() =>
                                                  dispatch({
                                                    type: 'AddOpenHour',
                                                    value: { day },
                                                    org: getOrganizationById(block.idOrganization)?.id,
                                                  })
                                                }
                                                type='button'
                                              >
                                                <svg
                                                  className='w-6 h-6 text-cool-gray-500'
                                                  fill='none'
                                                  viewBox='0 0 24 24'
                                                  stroke='currentColor'
                                                >
                                                  <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                                  />
                                                </svg>
                                              </button>
                                            </div>
                                            {block?.openHours[day].length === 0
                                              ? 'Cerrado'
                                              : block?.openHours[day].map((interval: Interval, index: number) => (
                                                  <TimeInterval
                                                    key={`${index}-${interval.start}-${interval.end}`}
                                                    id={`${index}-${day}`}
                                                    start={interval.start}
                                                    end={interval.end}
                                                    onDelete={() =>
                                                      dispatch({
                                                        type: 'RemoveOpenHour',
                                                        value: { day, index },
                                                        org: getOrganizationById(block.idOrganization)?.id,
                                                      })
                                                    }
                                                    onChange={interval =>
                                                      dispatch({
                                                        type: 'ChangeOpenHour',
                                                        value: { day, index, interval },
                                                        org: getOrganizationById(block.idOrganization)?.id,
                                                      })
                                                    }
                                                    setModality={elem => {
                                                      interval.appointmentType = elem
                                                    }}
                                                    modality={interval.appointmentType}
                                                  />
                                                ))}
                                          </fieldset>
                                        ))}
                                      </div>
                                    </Disclosure.Panel>
                                  </>
                                )}
                              </Disclosure>
                            </div>
                          </div>
                        )
                      })}
                      <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                        <SaveButton error={error} loading={loading} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Settings

interface SaveButtonProps {
  error?: string
  // success?: string
  loading?: boolean
}

const SaveButton = ({ error, loading }: SaveButtonProps) => {
  return (
    <>
      {error && <span className='mt-2 mr-2 text-sm text-red-600'>{error}</span>}
      {/* {success && <span className='mt-2 mr-2 text-sm text-green-600'>{success}</span>} */}

      <span className='inline-flex rounded-md shadow-sm'>
        <button
          type='submit'
          className='inline-flex justify-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700 sm:text-sm sm:leading-5'
          disabled={loading}
        >
          {loading && (
            <svg className='w-5 h-5 mr-3 -ml-1 text-white animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          )}
          Guardar
        </button>
      </span>
    </>
  )
}

interface TimeIntervalProps {
  start: number
  end: number
  onDelete: () => void
  onChange: (arg0: Interval) => void
  id: number | string
  setModality: any
  modality: string
}

const TimeInterval = (props: TimeIntervalProps) => {
  const [localModality, setLocalModality] = useState(props.modality)
  const start = !props.start ? '00:00' : new Date(props.start * 1000 * 60).toISOString().substr(11, 5)
  const end = !props.end ? '00:00' : new Date(props.end * 1000 * 60).toISOString().substr(11, 5)
  const { setModality, modality } = props

  useEffect(() => {
    if (modality === undefined) {
      setModality('V')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toMin = (val: string) => {
    if (!val) return 0
    const a = val.split(':')
    return +a[0] * 60 + +a[1]
  }

  return (
    <div className='flex items-center mt-3'>
      <div className='flex-grow mt-1 bg-white rounded-md shadow-sm'>
        <div className='flex -mt-px'>
          <div className='flex flex-1 w-1/2 min-w-0'>
            <label
              htmlFor={`${props.id}-start`}
              className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 sm:text-sm'
            >
              Inicio
            </label>
            <input
              id={`${props.id}-start`}
              className='flex-1 block w-full min-w-0 transition duration-150 ease-in-out rounded-none form-input sm:text-sm sm:leading-5'
              // YOU MIGHT WONDER WHY THIS IS SO FUCKED UP?
              // WELL... SAFARI does not support type="time".
              // It's a bug open for 10 years. Thank you Apple.
              type='time'
              placeholder='hh:mm'
              defaultValue={start}
              onBlur={e => {
                let value = e.target.value
                const match = value.match(/((\d{2}):(\d{2}))/)

                if (
                  match?.[0] !== value ||
                  isNaN(+match?.[2]) ||
                  isNaN(+match?.[3]) ||
                  +match?.[2] > 23 ||
                  +match?.[3] > 59
                ) {
                  e.target.value = ''
                  props.onChange({ start: toMin('00:00'), end: props.end, appointmentType: localModality })
                  return
                }
                props.onChange({ start: toMin(value), end: props.end, appointmentType: localModality })
              }}
              required
            />
          </div>
          <div className='flex flex-1 min-w-0 -ml-px'>
            <label
              htmlFor={`${props.id}-end`}
              className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 bg-gray-50 sm:text-sm'
            >
              Fin
            </label>
            <input
              id={`${props.id}-end`}
              className='flex-1 block w-full min-w-0 transition duration-150 ease-in-out rounded-none form-input rounded-r-md sm:text-sm sm:leading-5'
              type='time'
              placeholder='hh:mm'
              defaultValue={end}
              onBlur={e => {
                let value = e.target.value
                const match = value.match(/((\d{2}):(\d{2}))/)

                if (
                  match?.[0] !== value ||
                  isNaN(+match?.[2]) ||
                  isNaN(+match?.[3]) ||
                  +match?.[2] > 23 ||
                  +match?.[3] > 59
                ) {
                  e.target.value = ''
                  props.onChange({ start: props.start, end: toMin('00:00'), appointmentType: localModality })
                  return
                }
                props.onChange({ start: props.start, end: toMin(value), appointmentType: localModality })
              }}
              required
              min={start}
            />
          </div>
        </div>
      </div>
      <button
        className='flex items-center justify-center w-8 h-8 ml-2 rounded-full focus:outline-none focus:bg-cool-gray-100'
        onClick={() => props.onDelete()}
        type='button'
      >
        <svg className='w-4 h-4 text-cool-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
      </button>
      <AppoinmentModality
        modality={modality}
        setDataCallback={elem => {
          setModality(elem)
          setLocalModality(elem)
        }}
      />
    </div>
  )
}
export function AppoinmentModality(props) {
  const { setDataCallback, modality = 'V' } = props
  const [selection, setSelection] = useState(modality)
  const handleChange = event => {
    setSelection(event.target.value as string)
    setDataCallback(event.target.value)
  }

  return (
    <Box style={{ marginTop: '-15px' }} sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='simple-select-label'>Modalidad</InputLabel>
        <Select
          labelId='simple-select-label'
          id='simple-select'
          value={selection}
          label='modalidad'
          onChange={handleChange}
        >
          <MenuItem value={'V'}>Virtual</MenuItem>
          <MenuItem value={'A'}>Presencial</MenuItem>
          <MenuItem value={'AV'}>Ambos</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
