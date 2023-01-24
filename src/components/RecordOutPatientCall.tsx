import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Disclosure } from '@headlessui/react'
import { toUpperLowerCase } from '../util/helpers';
import ArrowDown from './icons/ArrowDown';
import differenceInYears from 'date-fns/differenceInYears';
import UserCircle from './icons/patient-register/UserCircle';
import SearchIcon from './icons/SearchIcon';
import { AppointmentWithPatient, DescripcionRecordPatientProps, OffsetType, PatientRecord, QueryFilter } from './RecordsOutPatient';
import axios from 'axios';
import * as Sentry from '@sentry/react'
import _ from 'lodash';


type Props = {
  children: React.ReactNode;
  appointment: AppointmentWithPatient;
}

const stylePanelSidebar = {
  background: 'rgba(107, 107, 107, 0.56)',
  backdropFilter: 'blur(14px)'
}

const RecordOutPatientCall: React.FC<Props> = ({ children, appointment }) => {

  const [recordOutPatientButton, setRecordOutPatientButton] = useState(false)
  //const sidebarRef = useRef<HTMLDivElement>()
  const [hoverSidebar, setHoverSidebar] = useState(false)

  const onClickOutPatientRecord = () => {
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  const handleSidebarHoverOn = () => {
    setHoverSidebar(true)
  }

  const handleSidebarHoverOff = () => {
    if (recordOutPatientButton) return
    setHoverSidebar(false)
  }

  //current doctor
  let doctor = {
    id: appointment?.doctorId,
    name: appointment?.doctor.givenName.split(' ')[0],
    lastName: appointment?.doctor.familyName.split(' ')[0],
  }

  const patientId = appointment.patientId

  // error page
  const [error, setError] = useState(false)

  // reference to listen to scroll event
  const scrollEvent = useRef<HTMLDivElement>()

  // Scroll Trigger loading
  const [loadingScroll, setLoadingScroll] = useState(false)

  const [recordsPatient, setRecordsPatient] = useState<PatientRecord[]>([])

  // pagination parameters
  const countPage = 10
  const [offsetPage, setOffsetPage] = useState<OffsetType>({ offset: 1, total: 0 })

  //Detail activated
  const [activeID, setActiveID] = useState('')

  //Filters
  const [inputContent, setInputContent] = useState('')

  // all doctors or current doctor doctor.id or ALL doctors
  const [filterDoctor, setFilterDoctor] = useState('ALL')

  //filter order ASC or DESC
  const [filterOrder, setFilterOrder] = useState('DESC')

  const [detailRecordPatient, setDetailRecordPatient] = useState<DescripcionRecordPatientProps>(null)
  const [loading, setLoading] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [totalRecordsPatient, setTotalRecordsPatient] = useState(0)

  //methods
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
        //addErrorToast('Ha ocurrido un error al traer más registros' + err.message)
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
//        addErrorToast('Ha ocurrido un error al traer el detalle: ' + err.message)
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
    if (!recordOutPatientButton) return
    handleSidebarHoverOff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOutPatientButton])

  return (
    <div className='flex flex-no-wrap relative h-full'>
      <div className={`flex flex-col absolute group ${hoverSidebar && 'cursor-pointer w-60'} w-24 inset-0 z-50 bg-gray-100 transition-all duration-500`}
        onMouseOver={() => handleSidebarHoverOn()}
        onMouseLeave={() => handleSidebarHoverOff()}
      >
        <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
          <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
            className='border-1 border-white rounded-full w-15 h-15 object-cover' />
        </div>
        <Disclosure>
          {({ open }) => (
            <div className={`w-0 ${hoverSidebar && 'w-auto opacity-100'} opacity-0 flex flex-col justify-center bg-white rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate`}>
              <Disclosure.Button className="focus:outline-none ">
                <div className='flex flex-row flex-no-wrap justify-center text-xl text-cool-gray-700 font-semibold truncate'>
                  <span className='truncate'> {toUpperLowerCase(appointment.patient.givenName.split(' ')[0] + ' ' + appointment.patient.familyName.split(' ')[0])}</span>
                  <ArrowDown className={`${open ? 'rotate-180 transform' : ''}`} />
                </div>
                <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>{appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                  ? 'Paciente sin cédula'
                  : 'CI ' + appointment.patient.identifier}</span>
              </Disclosure.Button>
              <Disclosure.Panel className="focus:outline-none ">
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Edad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(appointment.patient.birthDate))}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Profesion</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.job}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Teléfono</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.phone}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Ciudad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.city}</span>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <div className='flex flex-row flex-no-wrap justify-center items-center '>
          <button className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`} onClick={() => onClickOutPatientRecord()}>
            <UserCircle className='w-5 h-5' fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
            <div className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${recordOutPatientButton && 'text-primary-600 font-semibold'}`} style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}>Registro Ambulatorio</div>
          </button>
        </div>
      </div>
      <div
        className={`opacity-0 ${recordOutPatientButton && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
        style={{ width: recordOutPatientButton ? '21.6rem' : '0px' }}
      >
        <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center'>
          <span className='text-white font-medium text-sm truncate'>Registro de consultas ambulatorias</span>
        </div>
        <div className={`flex flex-col flex-1 p-2 items-center`} style={stylePanelSidebar}>
          <div className='flex flex-row flew-no-wrap w-full items-center'>
            <div className='w-full h-11 relative bg-cool-gray-50 rounded-lg mb-5 mt-5 mr-2'>
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
        </div>
      </div>
      {children}
    </div>
  )
}

export default RecordOutPatientCall
