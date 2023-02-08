import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Disclosure } from '@headlessui/react'
import { toUpperLowerCase } from '../util/helpers';
import ArrowDown from './icons/ArrowDown';
import differenceInYears from 'date-fns/differenceInYears';
import UserCircle from './icons/patient-register/UserCircle';
import SearchIcon from './icons/SearchIcon';
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
import loadGif from '../assets/loading.gif'
import { AppointmentWithPatient, DescripcionRecordPatientDetail, DescripcionRecordPatientProps, OffsetType, PatientRecord, QueryFilter } from './RecordsOutPatient';
import axios from 'axios';
import * as Sentry from '@sentry/react'
import _ from 'lodash';
import ArrowBackIOS from './icons/ArrowBack-ios';
import { useToasts } from './Toast';
import CloseButton from './icons/CloseButton';
import NoProfilePicture from './icons/NoProfilePicture';
import StudyHistory from './icons/StudyHistory';
import { HEIGHT_NAVBAR, HEIGHT_BAR_STATE_APPOINTMENT, WIDTH_XL } from "../util/constants";
import useWindowDimensions from "../util/useWindowDimensions";
import NoResults from './icons/NoResults';
import DiagnosticReportCard from './studiesorder/DiagnosticReportCard';


type Props = {
  children: React.ReactNode;
  appointment: AppointmentWithPatient;
}

const stylePanelSidebar = {
  background: 'rgba(107, 107, 107, 0.56)',
  backdropFilter: 'blur(14px)'
}

// uncomment when necessary
// type ServiceRequests = Array<Boldo.ServiceRequest>
type DiagnosticReports = Array<Boldo.DiagnosticReport>

const RecordOutPatientCall: React.FC<Props> = ({ children, appointment }) => {

  const [recordOutPatientButton, setRecordOutPatientButton] = useState(false)
  // uncomment when necessary
  // const [studyHistorySelected, setStudyHistorySelected] = useState(false)
  const [diagnosticReportSelected, setDiagnosticReportSelected] = useState<boolean>(false)

  const [hoverSidebar, setHoverSidebar] = useState(false)

  const { width } = useWindowDimensions()

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
  
    //show Detail
    const [showDetail, setShowDetail] = useState(false)
  
    const [detailRecordPatient, setDetailRecordPatient] = useState<DescripcionRecordPatientProps>()
    const [loading, setLoading] = useState(false)
    // uncomment when necessary
    // const [loadingStudyHistory, setLoadingStudyHistory] = useState<boolean>(false)
    // const [studyHistoryData, setStudyHistoryData] = useState<ServiceRequests>(undefined)
    const [loadingDiagnosticReports, setLoadingDiagnosticReports] = useState<boolean>(false)
    const [diagnosticReports, setDiagnosticReports] = useState<DiagnosticReports>(undefined)
  
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [totalRecordsPatient, setTotalRecordsPatient] = useState(0)
  
    const { addErrorToast } = useToasts()
  
    const container = useRef<HTMLDivElement>(null)


  const onClickOutPatientRecord = () => {
    setDiagnosticReportSelected(false)
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  const onClickDiagnosticReport = () => {
    setRecordOutPatientButton(false)
    setDiagnosticReportSelected(!diagnosticReportSelected)
  }

  const handleSidebarHoverOn = () => {
    setHoverSidebar(true)
  }

  // leave the sidebar fixed
  const handleSidebarHoverOff = () => {
    if (recordOutPatientButton || diagnosticReportSelected) return
    setHoverSidebar(false)
  }

  //current doctor
  let doctor = {
    id: appointment?.doctorId,
    name: appointment?.doctor.givenName.split(' ')[0],
    lastName: appointment?.doctor.familyName.split(' ')[0],
  }

  const patientId = appointment.patientId



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
    if (!recordOutPatientButton && !diagnosticReportSelected) {
      handleSidebarHoverOff()
      if (recordsPatient.length === 0) {
        setInputContent('')
        setFilterDoctor('ALL')
        setFilterOrder('DESC')
      }
      return
    }
    if (recordOutPatientButton && recordsPatient.length === 0)
      getRecordsPatient({ offset: 1, count: countPage, order: 'DESC', doctorId: 'ALL' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOutPatientButton, diagnosticReportSelected])

  useEffect(() => {
    setActiveID('')
  }, [recordsPatient])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!recordOutPatientButton && !diagnosticReportSelected) return
        if (recordOutPatientButton) {
          setRecordOutPatientButton(false)
          setShowDetail(false)
          setActiveID('')
        }
        if (diagnosticReportSelected) {
          setDiagnosticReportSelected(false)
        }
      }
    }
    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOutPatientButton, diagnosticReportSelected])


  // uncomment this when necessary
  // call this function to get the service requests
  // const loadServiceRequest = async (patientId: String = '') => {
  //   const url = '/profile/doctor/serviceRequests'
  //   setLoadingStudyHistory(true)
  //   await axios
  //     .get(url, {
  //       params: {
  //         patient_id: patientId
  //       }
  //     })
  //     .then((res) => {
  //       setStudyHistoryData(res.data.items as ServiceRequests)
  //     })
  //     .catch((err) => {
  //       Sentry.setTags({
  //         'endpoint': `${url}?patient_id=${patientId}`,
  //         'method': 'GET'
  //       })
  //       if (err.response) {
  //         // The response was made and the server responded with a 
  //         // status code that is outside the 2xx range.
  //         Sentry.setTags({
  //           'data': err.response.data,
  //           'headers': err.response.headers,
  //           'status_code': err.response.status
  //         })
  //       } else if (err.request) {
  //         // The request was made but no response was received
  //         Sentry.setTag('request', err.request)
  //       } else {
  //         // Something happened while preparing the request that threw an Error
  //         Sentry.setTag('message', err.message)
  //       }
  //       Sentry.captureMessage("Could not get the service requests")
  //       Sentry.captureException(err)
  //     })
  //     .finally(() => setLoadingStudyHistory(false))
  // }

  // useEffect(() => {
  //   // console.log("study history => ", studyHistoryData)
  //   if (studyHistorySelected && studyHistoryData === undefined)
  //     loadServiceRequest(appointment.patientId)
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [studyHistorySelected])

  useEffect(() => {
    // console.log("study history => ", studyHistoryData)
    if (diagnosticReportSelected && diagnosticReports === undefined)
      loadDiagnosticReports(appointment.patientId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticReportSelected])

  // call this function to get the service requests
  const loadDiagnosticReports = async (patientId: String = '') => {
    const url = '/profile/doctor/diagnosticReports'
    setLoadingDiagnosticReports(true)
    await axios
      .get(url, {
        params: {
          patient_id: patientId
        }
      })
      .then((res) => {
        setDiagnosticReports(res.data.items as DiagnosticReports)
      })
      .catch((err) => {
        Sentry.setTags({
          'endpoint': `${url}?patient_id=${patientId}`,
          'method': 'GET'
        })
        if (err.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTags({
            'data': err.response.data,
            'headers': err.response.headers,
            'status_code': err.response.status
          })
        } else if (err.request) {
          // The request was made but no response was received
          Sentry.setTag('request', err.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', err.message)
        }
        Sentry.captureMessage("Could not get the diagnostic reports")
        Sentry.captureException(err)
      })
      .finally(() => setLoadingDiagnosticReports(false))
  }


  return (
    <div className='flex flex-no-wrap relative h-full'>
      <div className='p-0 m-0 flex flex-no-wrap h-full' ref={container}>
        <div className={`flex flex-col absolute group ${hoverSidebar && 'cursor-pointer w-60'} w-24 inset-0 z-50 bg-gray-100 transition-all duration-500`}
          onMouseOver={() => handleSidebarHoverOn()}
          onMouseLeave={() => handleSidebarHoverOff()}
        >
          <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
            {appointment.patient.photoUrl ? <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
              className='border-1 border-white rounded-full w-15 h-15 object-cover' /> :
              <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-15 h-15' />
            }
          </div>
          <Disclosure>
            {({ open }) => (
              <div className={`w-0 ${hoverSidebar && 'w-auto opacity-100'} opacity-0 flex flex-col justify-start bg-white rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate scrollbar`} style={{ height: open ? '310px' : '', overflowY: 'auto' }}>
                <Disclosure.Button className="focus:outline-none" style={{ height: '54px' }}>
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
                    <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(appointment.patient.birthDate)) || '-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Profesion</span>
                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.job || '-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Teléfono</span>
                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.phone || '-'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Ciudad</span>
                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.city || '-'}</span>
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
          {/* button for study history */}
          <div className='flex flex-row flex-no-wrap justify-center items-center'>
            <button
              className='flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none'
              onClick={() => onClickDiagnosticReport()}
            >
              <StudyHistory className='w-5 h-5' fill={`${diagnosticReportSelected ? '#13A5A9' : '#6B7280'}`} />
              <div
                className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${diagnosticReportSelected && 'text-primary-600 font-semibold'}`}
                style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
              >
                Historial de estudios
              </div>
            </button>
          </div>
          {/* button for record out patient */}
          <div className='flex flex-row flex-no-wrap justify-center items-center '>
            <button 
              className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`} 
              onClick={() => onClickOutPatientRecord()}
            >
              <UserCircle className='w-5 h-5' fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
              <div 
                className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${recordOutPatientButton && 'text-primary-600 font-semibold'}`} 
                style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
              >
                Registro Ambulatorio
              </div>
            </button>
          </div>
        </div>
        <div
          className={`opacity-0 ${(recordOutPatientButton || diagnosticReportSelected) && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
          style={{ width: (recordOutPatientButton || diagnosticReportSelected) ? '21.6rem' : '0px' }}
        >
          <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center justify-between'>
            <span className='text-white font-medium text-sm truncate'>
              {
                recordOutPatientButton 
                  ? 'Registro de consultas ambulatorias'
                  : diagnosticReportSelected
                    ? 'Historial de estudios subidos'
                    : ''
              }
            </span>
            <button className='focus:outline-none' onClick={() => {
              if (recordOutPatientButton) {
                setRecordOutPatientButton(false)
                setShowDetail(false)
                setActiveID('')
              } else if (diagnosticReportSelected) {
                setDiagnosticReportSelected(false)
              }
            }}>
              <CloseButton />
            </button>
          </div>
          <div className={`flex flex-col flex-1 p-2 items-center`} style={stylePanelSidebar}>
            <div className='flex flex-row flew-no-wrap w-full items-center'>
              {!showDetail && !diagnosticReportSelected &&
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
                    value={inputContent}
                    onChange={e => {
                      setInputContent(e.target.value)
                      debounce(e.target.value.trim())
                    }}
                  />
                </div>}
              {!showDetail && !diagnosticReportSelected &&
                <QueryFilter
                  currentDoctor={doctor}
                  setFilterAuthor={setFilterDoctor}
                  setOrder={setFilterOrder}
                  getApiCall={getRecordsPatient}
                  inputContent={inputContent}
                  countPage={countPage}
                  activeColor={true}
                />}
            </div>
            { diagnosticReportSelected && 
              <div
                className={`flex flex-col overflow-x-hidden mx-1 scrollbar w-full ${loadingDiagnosticReports && 'justify-center items-center'} `}
                style={{ 
                  height: ` ${width >= WIDTH_XL
                    ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)`
                    : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`
                  }` 
                }}
              >
                {loadingDiagnosticReports && <SpinnerLoading />}
                {!loadingDiagnosticReports && diagnosticReports &&
                  (diagnosticReports.length === 0
                    ? <div className='flex flex-col justify-center items-center'>
                        <NoResults />
                        <span className='font-semibold text-white'>No hay estudios subidos</span>
                      </div>
                    : diagnosticReports.map((report, index) => (
                      <DiagnosticReportCard 
                        key={index}
                        // selected={}
                        report={report}
                        // onActiveId={}
                        darkMode={true}
                        // onShowStudyDetail={}
                        isCall={true}
                      />
                    ))
                  )
                }
              </div>
            }
            {!showDetail && !error && recordOutPatientButton &&
              <div
                className={`flex flex-col overflow-x-hidden mx-1 scrollbar w-full ${loading && 'justify-center items-center'
                  }`}
                style={{ height: 'calc(100vh - 230px)' }}
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
                      darkMode={true}
                      onShowDetail={() => { setShowDetail(true) }}
                      isCall={true}
                    />
                  ))}

                {!loading && totalRecordsPatient === 0 &&
                  <div className='flex flex-row w-full justify-center items-center text-white font-bold'>
                    No se encontraron resultados.
                  </div>
                }
              </div>}

            {error && <div className='flex flex-col w-full h-full items-center justify-center'>
              <div className='mt-6 text-center sm:mt-5'>
                <h3 className='text-lg font-medium leading-6 text-white' id='modal-headline'>
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
            </div>}


            {!showDetail && !error &&
              <div className='flex flex-row flex-no-wrap relative w-full justify-center'>
                <img className={`${!loadingScroll && 'hidden'} absolute w-15 h-15 z-50`} src={loadGif} alt='loading gif' style={{ bottom: '-2rem' }} />
              </div>
            }

            {showDetail && !error &&
              <div className='flex flex-col flex-no-wrap w-full flex-1'>
                <div className="flex flex-row flex-no-wrap items-start">
                  <button className='flex flex-row text-white focus:outline-none justify-center items-center gap-1' onClick={() => setShowDetail(false)}>
                    <ArrowBackIOS fill='#FFFFFF' style={{
                      margin: '0 auto',
                      transform: 'scale(.7)',
                    }} /> atrás
                  </button>
                </div>
                <div
                  className={`flex flex-col w-full overflow-y-auto scrollbar items-center justify-center mt-5`}
                  style={{ height: 'calc(100vh - 230px)' }}
                >

                  {loadingDetail && <SpinnerLoading />}
                  {!loadingDetail && <DescripcionRecordPatientDetail data={detailRecordPatient} darkMode={true} isCall={true} />}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default RecordOutPatientCall
