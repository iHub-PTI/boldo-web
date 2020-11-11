import React, { useState, useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import Layout from '../components/Layout'
import Listbox from '../components/Listbox'
import MultiListbox from '../components/MultiListbox'
import Languages from '../util/ISO639-1-es.json'
import { validateDate } from '../util/helpers'
import { UserContext } from '../App'

export const fileTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/webp']

export function validFileType(file: string) {
  return fileTypes.includes(file)
}

export const upload = async (file: File | string) => {
  if (!file) return
  if (typeof file === 'string') return file
  try {
    const res = await axios.get('/presigned')
    const ress = await axios({
      method: 'put',
      url: `${res.data.uploadUrl}&x-amz-acl=public-read`,
      data: file,
      withCredentials: false,
      headers: { 'Content-Type': file.type, authentication: null },
    })
    if (ress.status === 200) return res.data.location
  } catch (err) {
    console.log(err)
  }
}

interface Interval {
  start: number
  end: number
}

type weekDay = keyof typeof weekDays
const weekDays = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

type DoctorForm = Omit<Boldo.Doctor, 'photoUrl' | 'id'> & { photoUrl?: Boldo.Doctor['photoUrl'] | File | null }

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
  openHours: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
}

type Action =
  | { type: 'initial'; value: DoctorForm }
  | { type: 'default'; value: Partial<DoctorForm> }
  | { type: 'AddOpenHour'; value: { day: weekDay } }
  | { type: 'RemoveOpenHour'; value: { day: weekDay; index: number } }
  | { type: 'ChangeOpenHour'; value: { day: weekDay; index: number; interval: Interval } }

function reducer(state: DoctorForm, action: Action): DoctorForm {
  switch (action.type) {
    case 'initial': {
      return action.value
    }

    case 'default':
      return { ...state, ...action.value }

    case 'AddOpenHour': {
      const day = [...state.openHours[action.value.day], { start: 0, end: 0 }]

      const openHours = { ...state.openHours, [action.value.day]: day }
      return { ...state, openHours }
    }

    case 'RemoveOpenHour': {
      const day = state.openHours[action.value.day].filter((_, i) => i !== action.value.index)

      const openHours = { ...state.openHours, [action.value.day]: day }
      return { ...state, openHours }
    }

    case 'ChangeOpenHour': {
      const day = state.openHours[action.value.day].map((interval, i) =>
        i === action.value.index ? action.value.interval : interval
      )

      const openHours = { ...state.openHours, [action.value.day]: day }
      return { ...state, openHours }
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
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const { updateUser } = useContext(UserContext)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await axios.get<Boldo.Doctor | null>('/profile/doctor')
        const res2 = await axios.get<iHub.Specialization[]>('/specializations')

        if (mounted) {
          if (res.data) dispatch({ type: 'initial', value: res.data })
          const specializations = res2.data.map(spec => {
            return { value: spec.id.toString(), name: spec.description }
          })
          setSpecializations(specializations)
          setShow(true)
        }
      } catch (err) {
        console.log(err)
        if (mounted) {
          setError('ERROR: Failed to load initial Data')
          setShow(true)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [history])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let validationError = false

    if (!validateDate(doctor.birthDate, 'past')) {
      validationError = true
      setError('Fecha de nacimiento!')
    }

    if (doctor.languages.length === 0) {
      validationError = true
      setError('Add at least one Language!')
    }

    if (doctor.specializations.length === 0) {
      validationError = true
      setError('Add one specialization!')
    }

    if (doctor.gender === 'unknown') {
      validationError = true
      setError('Please select a Género!')
    }

    if (!validationError) {
      try {
        let photoUrl = doctor.photoUrl
        if (doctor.photoUrl) {
          photoUrl = await upload(doctor.photoUrl)

          if (!photoUrl) return setError('Ha ocurrido un error con las imágenes! Intente de nuevo.')
          dispatch({ type: 'default', value: { photoUrl } })
        }

        await axios.post('/profile/doctor', { ...doctor, photoUrl })
        setSuccess('Actualización exitosa!')
        updateUser({
          ...(typeof photoUrl === 'string' && { photoUrl }),
          givenName: doctor.givenName,
          familyName: doctor.familyName,
          openHours: doctor.openHours,
        })
      } catch (err) {
        setError(err.response?.data.message || 'Ha ocurrido un error! Intente de nuevo.')
        console.log(err)
      }
    }

    setLoading(false)
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
              <div className='flex flex-col-reverse items-center sm:flex-row'>
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
              </div>
            </div>
            <div className='mt-6'>
              <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                  <div className='px-4 sm:px-0'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Perfil</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>This information will be displayed publicly.</p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='px-4 py-5 bg-white sm:p-6'>
                      <div className=''>
                        <label className='block text-sm font-medium leading-5 text-gray-700'>Photo</label>
                        <p className='mt-2 text-sm text-gray-500'>
                          Upload a Profile picture. For best quality, choose a square picture with 512 px.
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
                              Change
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
                              { value: 'male', name: 'Male' },
                              { value: 'female', name: 'Female' },
                              { value: 'other', name: 'Other' },
                              ...(doctor.gender === 'unknown'
                                ? [{ value: 'unknown', name: 'Please select a Género' }]
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
                            placeholder='Recibido en la Universidad Nacional de Asunción con especialización en Dermatología Pediátrica. Miembro de la asicioción DERLA hace 6 años.'
                            onChange={e => dispatch({ type: 'default', value: { biography: e.target.value } })}
                            value={doctor.biography}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} success={success} loading={loading} />
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
                    <p className='mt-1 text-sm leading-5 text-gray-600'>This information will be displayed publicly.</p>
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
                      <SaveButton error={error} success={success} loading={loading} />
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
                    <p className='mt-1 text-sm leading-5 text-gray-600'>This information will be displayed publicly.</p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='shadow sm:rounded-md sm:overflow-hidden'>
                    <div className='px-4 py-5 bg-white sm:p-6'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 mb-40 sm:col-span-3'>
                          <MultiListbox
                            data={specializations}
                            label='Especialidad Médica'
                            value={doctor.specializations}
                            onChange={value => dispatch({ type: 'default', value: { specializations: value } })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} success={success} loading={loading} />
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
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>Opening Hours</h3>
                    <p className='mt-1 text-sm leading-5 text-gray-600'>
                      Configure when customers can book appointments through the app.
                    </p>
                  </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                  <div className='overflow-hidden shadow sm:rounded-md'>
                    <div className='px-4 py-5 space-y-6 bg-white sm:p-6'>
                      {(Object.keys(weekDays) as Array<keyof typeof weekDays>).map(day => (
                        <fieldset key={day}>
                          <div className='flex items-center mb-3'>
                            <legend className='font-medium leading-5 text-gray-700 '>{weekDays[day]}</legend>
                            <button
                              className='flex items-center justify-center w-8 h-8 ml-1 rounded-full focus:outline-none focus:bg-cool-gray-100'
                              onClick={() => dispatch({ type: 'AddOpenHour', value: { day } })}
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
                          {doctor.openHours[day].length === 0
                            ? 'closed'
                            : doctor.openHours[day].map((interval: Interval, index: number) => (
                                <TimeInterval
                                  key={`${index}-${interval.start}-${interval.end}`}
                                  id={`${index}-${day}`}
                                  start={interval.start}
                                  end={interval.end}
                                  onDelete={() => dispatch({ type: 'RemoveOpenHour', value: { day, index } })}
                                  onChange={interval =>
                                    dispatch({ type: 'ChangeOpenHour', value: { day, index, interval } })
                                  }
                                />
                              ))}
                        </fieldset>
                      ))}
                    </div>
                    <div className='px-4 py-3 text-right bg-gray-50 sm:px-6'>
                      <SaveButton error={error} success={success} loading={loading} />
                    </div>
                  </div>
                </div>
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
  success?: string
  loading?: boolean
}

const SaveButton = ({ error, success, loading }: SaveButtonProps) => {
  return (
    <>
      {error && <span className='mt-2 mr-2 text-sm text-red-600'>{error}</span>}
      {success && <span className='mt-2 mr-2 text-sm text-green-600'>{success}</span>}

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
}

const TimeInterval = (props: TimeIntervalProps) => {
  const start = !props.start ? '00:00' : new Date(props.start * 1000 * 60).toISOString().substr(11, 5)
  const end = !props.end ? '00:00' : new Date(props.end * 1000 * 60).toISOString().substr(11, 5)

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
              start
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
                  props.onChange({ start: toMin('00:00'), end: props.end })
                  return
                }
                props.onChange({ start: toMin(value), end: props.end })
              }}
              required
            />
          </div>
          <div className='flex flex-1 min-w-0 -ml-px'>
            <label
              htmlFor={`${props.id}-end`}
              className='inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 bg-gray-50 sm:text-sm'
            >
              end
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
                  props.onChange({ start: props.start, end: toMin('00:00') })
                  return
                }
                props.onChange({ start: props.start, end: toMin(value) })
              }}
              required
              min={start}
            />
          </div>
        </div>
      </div>
      <button
        className='flex items-center justify-center w-8 h-8 ml-6 rounded-full focus:outline-none focus:bg-cool-gray-100'
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
    </div>
  )
}
