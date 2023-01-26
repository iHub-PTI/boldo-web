import React, { useState, useEffect, useCallback, useRef } from 'react'
import ArrowBackIOS from '../components/icons/ArrowBack-ios'
import SearchIcon from './icons/SearchIcon'
import { Disclosure, Popover } from '@headlessui/react'
import ArrowDown from './icons/ArrowDown'
import NoProfilePicture from './icons/NoProfilePicture'
import FilterListIcon from './icons/filter-icons/FilterListIcon'
import PersonIcon from './icons/filter-icons/PersonIcon'
import ArrowUpWardIcon from './icons/filter-icons/ArrowUpWardIcon'
import ArrowDownWardIcon from './icons/filter-icons/ArrowDownWardIcon'
import StethoscopeIcon from './icons/filter-icons/StethoscopeIcon'
import axios from 'axios'
import { countDays, toUpperLowerCase } from '../util/helpers'
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
import _ from 'lodash'
import loadGif from '../assets/loading.gif'
import * as Sentry from '@sentry/react'
import { useToasts } from './Toast'
import moment from 'moment'

export type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient }

type Props = {
  show?: boolean
  setShow?: (value: any) => void
  appointment?: AppointmentWithPatient
}

export type Specialization = {
  id: string
  description: string
}

export type Doctor = {
  active: boolean
  familyName: string
  gender: string
  givenName: string
  specializations: Specialization[]
  photoUrl?: string
}

export type Encounter = {
  diagnosis: string
  finishTimeDate: string
  id: string
  mainReason: string
}

export type PatientRecord = {
  doctorDto: Doctor
  encounterDto: Encounter
}

export type DescripcionRecordPatientProps = {
  mainReason: string
  diagnosis: string
  prescriptions: any[]
  soep: any
}

export type OffsetType = {
  offset: number
  total: number
}

export const RecordsOutPatient: React.FC<Props> = ({ show = false, setShow = () => { }, ...props }) => {
  const patientId = props.appointment.patientId
  const { addErrorToast } = useToasts()

  // error page
  const [error, setError] = useState(false)

  const [recordsPatient, setRecordsPatient] = useState<PatientRecord[]>([])

  const [detailRecordPatient, setDetailRecordPatient] = useState<DescripcionRecordPatientProps>(null)
  const [loading, setLoading] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [totalRecordsPatient, setTotalRecordsPatient] = useState(0)

  // pagination parameters
  const countPage = 10
  const [offsetPage, setOffsetPage] = useState<OffsetType>({ offset: 1, total: 0 })

  //Detail activated
  const [activeID, setActiveID] = useState('')

  //Filters
  const [inputContent, setInputContent] = useState('')

  //filter order ASC or DESC
  const [filterOrder, setFilterOrder] = useState('DESC')

  // all doctors or current doctor doctor.id or ALL doctors
  const [filterDoctor, setFilterDoctor] = useState('ALL')

  // reference to listen to scroll event
  const scrollEvent = useRef<HTMLDivElement>()

  // Scroll Trigger loading
  const [loadingScroll, setLoadingScroll] = useState(false)

  //current doctor
  let doctor = {
    id: props.appointment?.doctorId,
    name: props.appointment?.doctor.givenName.split(' ')[0],
    lastName: props.appointment?.doctor.familyName.split(' ')[0],
  }

  const getRecordsPatient = async ({ doctorId = 'ALL', content = '', count = 10, offset = 1, order = 'DESC' }) => {
    setError(false)
    setLoading(true)
    setDetailRecordPatient(null)
    await axios
      .get(`/profile/doctor/patient/${patientId}/encounters`, {
        params: {
          doctorId: doctorId === 'ALL' ? '' : doctor.id,
          content: content,
          count: count,
          offset: offset,
          order: order,
        },
      })
      .then(res => {
        setRecordsPatient(res.data.items)
        // calculate max offset
        setOffsetPage({ offset: offset, total: Math.ceil(res.data.total / countPage) })
        //console.log('get total records', res.data.total)
        // capture total patient records
        setTotalRecordsPatient(res.data.total)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        Sentry.setTags({
          'patient id': patientId,
          GET: `/profile/doctor/patient/${patientId}/encounters`,
          'Doctor Id session': doctor.id,
        })
        Sentry.captureException(err)
        setError(true)
      })
  }

  const debounce = useCallback(
    _.debounce(_searchContent => {
      getRecordsPatient({ content: _searchContent, offset: 1, order: filterOrder, doctorId: filterDoctor })
    }, 500),
    [filterDoctor, filterOrder]
  )

  const getRecordsPatientOnScroll = async ({
    doctorId = filterDoctor,
    content = inputContent,
    count = countPage,
    offset = 1,
    order = filterOrder,
  }) => {
    setLoadingScroll(true)
    await axios
      .get(`/profile/doctor/patient/${patientId}/encounters`, {
        params: {
          doctorId: doctorId === 'ALL' ? '' : doctor.id,
          content: content,
          count: count,
          offset: offset,
          order: order,
        },
      })
      .then(res => {
        setRecordsPatient([...recordsPatient, ...res.data.items])
        setOffsetPage({ offset: offset, total: Math.ceil(res.data.total / countPage) })
        setLoadingScroll(false)
      })
      .catch(err => {
        console.error(err)
        addErrorToast('Ha ocurrido un error al traer más registros' + err.message)
        Sentry.setTags({
          'patient id': patientId,
          GET: `/profile/doctor/patient/${patientId}/encounters`,
          'Doctor Id session': doctor.id,
        })
        Sentry.captureException(err)
      })
  }

  const onScrollEnd = () => {
    if (loading) return
    if (offsetPage.offset === offsetPage.total) return
    if (scrollEvent.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollEvent.current
      if (Math.trunc(scrollTop + clientHeight) === scrollHeight) {
        // TO SOMETHING HERE
        getRecordsPatientOnScroll({
          offset: offsetPage.offset + 1,
        })
      }
      //console.log("🚀 scrollTop + clientHeight", scrollTop + clientHeight)
      //console.log("🚀 scrollHeight", scrollHeight)

    }
  }

  const getRecordPatientDetail = async (id: string) => {
    //avoid double request when clicking
    if (id === activeID) return
    setLoadingDetail(true)
    await axios
      .get(`/profile/doctor/patient/${patientId}/encounters/${id}`)
      .then(res => {
        //console.log('data record patient details', res.data)
        setDetailRecordPatient(res.data)
        setLoadingDetail(false)
      })
      .catch(err => {
        addErrorToast('Ha ocurrido un error al traer el detalle: ' + err.message)
        console.error(err)
        Sentry.setTags({
          'patient id': patientId,
          GET: `/profile/doctor/patient/${patientId}/encounters/${id}`,
          'Doctor Id session': doctor.id,
        })
        Sentry.captureException(err)
      })
  }

  useEffect(() => {
    if (!show) {
      if (recordsPatient.length === 0) {
        setInputContent('')
        setFilterDoctor('ALL')
        setFilterOrder('DESC')
      }
      return
    }
    if (show && recordsPatient.length === 0)
      getRecordsPatient({ offset: 1, count: countPage, order: 'DESC', doctorId: 'ALL' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  useEffect(() => {
    console.log('🚀 ~ file: RecordsOutPatient.tsx:230 ~ filterOrder', filterOrder)
    console.log('🚀 ~ file: RecordsOutPatient.tsx:230 ~ filterDoctor', filterDoctor)
  }, [filterDoctor, filterOrder])

  useEffect(() => {
    setActiveID('')
  }, [recordsPatient])

  if (error)
    return (
      <div className='flex flex-col w-full h-full items-center justify-center'>
        <div className='mt-6 text-center sm:mt-5'>
          <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
            Ha ocurrido un error al traer los registros
          </h3>
        </div>
        <div className='flex justify-center w-full mt-6 sm:mt-8'>
          <button
            className='px-4 py-2 text-lg font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2'
            onClick={() => getRecordsPatient({ offset: 1, count: countPage })}
          >
            Inténtar de nuevo
          </button>
        </div>
      </div>
    )

  return (
    <div className='flex flex-col px-5 pt-5 w-full'>
      {/* Head */}
      <button
        className='flex flex-row items-center mb-2 h-11 max-w-max-content focus:outline-none'
        onClick={() => {
          setShow(false)
        }}
      >
        <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
      </button>

      {/* title outpatientRecord */}
      <div className='flex justify-start h-auto mb-1'>
        <div className='text-black font-bold text-2xl'>
          Registro de consultas ambulatorias
          <div className='text-cool-gray-400 font-normal text-xl'>
            Anotaciones, recetas y ordenes de estudios anteriores
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-2 items-center'>
        {/* input search */}
        <div className='w-64 h-auto relative bg-cool-gray-50 rounded-lg mb-5 mt-5'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <SearchIcon className='w-5 h-5' />
          </div>
          <input
            className='p-3 pl-10 w-full outline-none hover:bg-cool-gray-100 transition-colors delay-200 rounded-lg'
            type='search'
            name='search'
            placeholder='Motivo principal de la visita'
            title='Escriba el motivo principal de la visita'
            autoComplete='off'
            value={inputContent}
            onChange={e => {
              setInputContent(e.target.value)
              debounce(e.target.value.trim())
            }}
          />
        </div>
        <QueryFilter
          currentDoctor={doctor}
          setFilterAuthor={setFilterDoctor}
          setOrder={setFilterOrder}
          getApiCall={getRecordsPatient}
          inputContent={inputContent}
          countPage={countPage}
        />
      </div>

      {/* body */}
      <div className='flex flex-row w-full overflow-x-auto justify-center gap-3 relative overflow-y-hidden' style={{ minWidth: '600px' }}>
        <div
          className={`flex flex-col min-w-min-content overflow-x-hidden mx-1 scrollbar ${loading && 'justify-center items-center w-full'
            }`}
          style={{ height: 'calc(100vh - 380px)' }}
          ref={scrollEvent}
          onScroll={() => onScrollEnd()}
        >
          {loading && <SpinnerLoading />}
          {!loading &&
            recordsPatient.map((record, index) => (
              <PatientRecord
                key={index}
                patientRecord={record}
                getRecordPatientDetail={getRecordPatientDetail}
                selected={activeID === record.encounterDto.id}
                onActiveID={setActiveID}
              />
            ))}
        </div>
        <div
          className={`flex flex-col w-full overflow-y-auto scrollbar ${loadingDetail && 'items-center justify-center'}`}
          style={{ height: 'calc(100vh - 380px)' }}
        >
          {detailRecordPatient === null ? (
            <div className='h-full w-full flex items-center justify-center text-gray-200    font-bold text-3xl'>
              {loadingDetail ? (
                <SpinnerLoading />
              ) : !loading && totalRecordsPatient === 0 ? (
                'No se han encontrado registros'
              ) : (
                'Seleccione un elemento para mostrar'
              )}
            </div>
          ) : !loadingDetail ? (
            <DescripcionRecordPatientDetail data={detailRecordPatient} />
          ) : (
            <SpinnerLoading />
          )}
        </div>
        <img className={`${!loadingScroll && 'hidden'} absolute w-15 h-15 z-50 left-28`} src={loadGif} alt='loading gif' style={{ bottom: '-1rem' }} />
      </div>
    </div>
  )
}

export const PatientRecord = ({
  selected = false,
  patientRecord = {} as PatientRecord,
  getRecordPatientDetail = (id: string) => { },
  onActiveID = (id: string) => { },
  darkMode = false,
  onShowDetail = () => { },
  isCall = false,
  ...props
}) => {
  return (
    <div
      className={`flex flex-row pl-1 pt-1 ${isCall ? 'w-full' : 'w-64'} h-28 rounded-lg group cursor-pointer hover:bg-gray-100 mb-1 mx-1 truncate pr-1`}
      style={{ backgroundColor: selected ? darkMode ? 'rgba(248, 255, 255, 0.15)' : '#EDF2F7' : '', minHeight: '102px' }}
      onClick={() => {
        getRecordPatientDetail(patientRecord.encounterDto.id)
        onActiveID(patientRecord.encounterDto.id)
        onShowDetail()
      }}
      {...props}
    >
      <div className='flex flex-col w-2/12 mr-1'>
        {patientRecord.doctorDto.photoUrl ? (
          <img
            src={patientRecord.doctorDto.photoUrl}
            alt='Foto de Perfil'
            className='border-1 border-white rounded-full'
          />
        ) : (
          <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-10 h-10' />
        )}
      </div>
      <div className='flex flex-col w-full truncate'>
        <div
          className={`font-semibold text-base truncate w-full ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
          title={toUpperLowerCase(patientRecord.doctorDto.givenName + ' ' + patientRecord.doctorDto.familyName)}
        >
          {`${patientRecord.doctorDto.gender === 'male' ? 'Dr.' : 'Dra.'} ${toUpperLowerCase(
            patientRecord.doctorDto.givenName.split(' ')[0]
          )} ${toUpperLowerCase(patientRecord.doctorDto.familyName.split(' ')[0])}`}
        </div>
        <div
          className={`text-base pb-1 truncate ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
          title={toUpperLowerCase(patientRecord.doctorDto.specializations.map(c => c.description).join(', '))}
        >
          {toUpperLowerCase(patientRecord.doctorDto.specializations.map(c => c.description).join(', '))}
        </div>
        <div
          className={`font-normal w-44 truncate mb-1 group-hover:text-primary-500 ${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'}`}
          title={patientRecord.encounterDto.mainReason}
        >
          {patientRecord.encounterDto.mainReason}
        </div>
        <div className='flex flex-row gap-2'>
          <div className={`font-normal ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}>
            {moment(patientRecord.encounterDto.finishTimeDate.split('T')[0]).format('DD/MM/YYYY')}
          </div>
          <div className={`${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'}`}>{countDays(patientRecord.encounterDto.finishTimeDate.split('T')[0])}</div>
        </div>
        <span className='w-full h-0' style={{ borderBottom: darkMode ? '1px solid rgba(247, 244, 244, 0.2)' : '1px solid #F7F4F4' }}></span>
      </div>
    </div>
  )
}

export const DescripcionRecordPatientDetail = ({ data = {} as DescripcionRecordPatientProps, darkMode = false, isCall = true, ...props }) => {
  return (
    <div className='flex flex-col w-full h-full gap-5'>
      <div>
        <div className={`font-normal  ${darkMode ? 'text-gray-100' : 'text-primary-500'}`}>Motivo Principal de la visita</div>
        <div className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{data.mainReason}</div>
      </div>
      <div>
        <div className={`font-normal  ${darkMode ? 'text-gray-100' : 'text-primary-500'}`}>Impresión diagnóstica</div>
        <div className={`font-semibold ${darkMode ? 'text-white' : ''}`}>{data.diagnosis}</div>
      </div>
      {/* Prescriptions */}
      <div>
        <div className={`font-normal  ${darkMode ? 'text-gray-100' : 'text-primary-500'}`}>Prescripciones</div>
        <div className='flex flex-col gap-1 pt-1 justify-center items-start'>
          {data.prescriptions.map((prescription, index) => (
            <div key={index} className={`flex flex-row bg-gray-100 rounded-md  ${isCall ? 'w-full' : 'w-10/12'}`}>
              <div className='flex flex-col p-2 w-6/12'>
                <div className='text-black'>{prescription.medicationName}</div>
                <div className='text-gray-500'>{prescription.medicationDto.form}</div>
              </div>
              <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>
                {prescription.instructions ? prescription.instructions : 'Sin indicaciones'}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SOEP */}
      {Object.keys(data.soep).length > 0 && (
        <div>
          <div className={`font-normal  ${darkMode ? 'text-gray-100' : 'text-primary-500'}`}>Plan</div>
          <p className={`w-10/12  ${darkMode ? 'text-white font-semibold' : ''}`}>{data.soep.plan}</p>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className={`mt-3 p-2 flex flex-row focus:outline-none hover:bg-gray-100 transition-colors delay-200 rounded-md ${darkMode ? 'text-gray-100 hover:bg-opacity-25' : 'text-primary-500'}`}>
                  {open ? 'ocultar' : 'más anotaciones'}{' '}
                  <ArrowDown fill={darkMode ? '#FFFFFF' : '#13A5A9'} className={`${open ? 'rotate-180 transform' : ''}`} />
                </Disclosure.Button>
                <Disclosure.Panel className={`my-2 ${isCall ? 'w-full' : 'w-10/12'}`}>
                  <div className='flex flex-col p-2 bg-gray-100 rounded-md gap-2'>
                    <div>
                      <div className='font-semibold'>Subjetivo</div>
                      <p>{data.soep.subjective ? data.soep.subjective : 'Sin anotaciones'}</p>
                    </div>
                    <div>
                      <div className='font-semibold'>Objetivo</div>
                      <p>{data.soep.objective ? data.soep.objective : 'Sin anotaciones'}</p>
                    </div>
                    <div>
                      <div className='font-semibold'>Evaluación</div>
                      <p>{data.soep.evaluation ? data.soep.evaluation : 'Sin anotaciones'}</p>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      )}
    </div>
  )
}

export const QueryFilter = ({
  currentDoctor = {} as { id: string; name: string; lastName: string },
  setFilterAuthor,
  setOrder,
  getApiCall,
  inputContent,
  countPage,
  activeColor = false
}) => {
  //Current Doctor or all Doctors [ 'all' || 'current' ]
  const [author, setAuthor] = useState('ALL')
  //Asc or Desc [ 'asc' || 'desc' ]
  const [sequence, setSequence] = useState('DESC')

  const AUTHOR_STATE = {
    current: 'CURRENT' === author,
    all: 'ALL' === author,
  }

  const SEQUENCE_STATE = {
    asc: 'ASC' === sequence,
    desc: 'DESC' === sequence,
  }

  const onClickCurrentDoctor = () => {
    setAuthor('CURRENT')
    getApiCall({
      doctorId: 'CURRENT',
      content: inputContent,
      count: countPage,
      offset: 1,
      order: sequence,
    })
  }

  const onClickAllDoctor = () => {
    setAuthor('ALL')
    getApiCall({
      doctorId: 'ALL',
      content: inputContent,
      count: countPage,
      offset: 1,
      order: sequence,
    })
  }

  const onClickSequenceAsc = () => {
    setSequence('ASC')
    console.log(author)
    getApiCall({
      doctorId: author,
      content: inputContent,
      count: countPage,
      offset: 1,
      order: 'ASC',
    })
  }

  const onClickSequenceDesc = () => {
    setSequence('DESC')
    console.log(author)
    getApiCall({
      doctorId: author,
      content: inputContent,
      count: countPage,
      offset: 1,
      order: 'DESC',
    })
  }

  useEffect(() => {
    setOrder(sequence)
    setFilterAuthor(author)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence, author])

  return (
    <Popover className='relative'>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of the chevron icon. */
        <>
          <Popover.Button className='focus:outline-none' title='Filtros'>
            <FilterListIcon active={activeColor || open} />
          </Popover.Button>
          <Popover.Panel className='absolute left-10 z-10 mt-3 -translate-x-1/2 transform px-4 w-72'>
            <div
              className='flex flex-col bg-blue-100 p-3 rounded-2xl shadow-xl gap-3'
              style={{ backgroundColor: '#EDF2F7' }}
            >
              <div className='flex flex-col'>
                <div className='font-semibold text-gray-500 mb-1'>Autor</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${AUTHOR_STATE['current'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl focus:outline-none`}
                    onClick={() => onClickCurrentDoctor()}
                  >
                    <PersonIcon className='mr-1' active={AUTHOR_STATE['current']} />
                    <div className={`font-semibold ${AUTHOR_STATE['current'] && 'text-primary-500'}`}>
                      {toUpperLowerCase(currentDoctor.name + ' ' + currentDoctor.lastName)}
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${AUTHOR_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickAllDoctor()}
                  >
                    <StethoscopeIcon className='mr-1' active={AUTHOR_STATE['all']} />
                    <div className={`font-semibold ${AUTHOR_STATE['all'] && 'text-primary-500'}`}>
                      Todos los médicos
                    </div>
                  </button>
                </div>
                <div className='font-semibold text-gray-500 mb-1'>Orden</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['desc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl`}
                    onClick={() => onClickSequenceDesc()}
                  >
                    <ArrowDownWardIcon className='mr-1' active={SEQUENCE_STATE['desc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['desc'] && 'text-primary-500'}`}>
                      Nuevos Primero
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['asc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickSequenceAsc()}
                  >
                    <ArrowUpWardIcon className='mr-1' active={SEQUENCE_STATE['asc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['asc'] && 'text-primary-500'}`}>
                      Antiguos Primero
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}
