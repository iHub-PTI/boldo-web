import { Popover, Transition } from '@headlessui/react'
import React, { useCallback, useEffect, useState } from 'react'
import ArrowBackIOS from './icons/ArrowBack-ios'
import SearchIcon from './icons/SearchIcon'
import FilterListIcon from './icons/filter-icons/FilterListIcon'
import PersonIcon from './icons/filter-icons/PersonIcon'
import { countDays, toUpperLowerCase } from '../util/helpers'
import StethoscopeIcon from './icons/filter-icons/StethoscopeIcon'
import ArrowDownWardIcon from './icons/filter-icons/ArrowDownWardIcon'
import ArrowUpWardIcon from './icons/filter-icons/ArrowUpWardIcon'
import OrderWithIcon from './icons/filter-icons/OrderWithIcon'
import OrderWithoutIcon from './icons/filter-icons/OrderWithoutIcon'
import LabIcon from './icons/studies-category/LabIcon'
//import useWindowDimensions from '../util/useWindowDimensions'
import { ReactComponent as CalendarIcon } from "../assets/calendar-detail.svg"
import ImgIcon from './icons/studies-category/ImgIcon'
import PdfIcon from './icons/study_icon/PdfIcon'
import PictureIcon from './icons/study_icon/PictureIcon'
import ChevronRight from './icons/ChevronRight'
import EyeIcon from './icons/EyeIcon'
import PaperClipIcon from './icons/PaperClipIcon'
import { SOURCE_TYPE_STUDY, STUDY_TYPE, WIDTH_XL } from '../util/constants'
import useWindowDimensions from '../util/useWindowDimensions'
import moment from 'moment'
import axios from 'axios'
import handleSendSentry from '../util/Sentry/sentryHelper'
import { ERROR_HEADERS } from '../util/Sentry/errorHeaders'
import { useToasts } from './Toast'
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
import _ from 'lodash'
import NoProfilePicture from './icons/NoProfilePicture'
import OtherIcon from './icons/studies-category/OtherIcon'
import { ReactComponent as Spinner } from "../assets/spinner.svg";
import Modal from './Modal'
import CloseIcon from '@material-ui/icons/Close';

type StudyType = {
  authoredDate?: string;
  category?: string;
  description?: string;
  diagnosticReportAttachmentCount?: number;
  id?: string;
  sourceName?: string;
  sourceType?: 'diagnosticReport' | 'serviceRequest';
  type?: string;
};

type Props = {
  show: boolean,
  setShow: (value: boolean) => void
  appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization },
}

const StudyHistory: React.FC<Props> = ({
  show,
  setShow,
  appointment,
  ...props
}) => {

  //current doctor
  let doctor = {
    id: appointment?.doctorId,
    name: appointment?.doctor.givenName.split(' ')[0],
    lastName: appointment?.doctor.familyName.split(' ')[0],
  }

  const { addToast } = useToasts()

  const patientId = appointment?.patientId
  console.log(patientId)

  //states filters
  const [inputContent, setInputContent] = useState('')
  const [currentDoctor, setCurrentDoctor] = useState(false)
  const [newFirst, setNewFirst] = useState(true)
  const [withOrder, setWithOrder] = useState(undefined) // true or false or undefined

  // list of study
  const [dataStudy, setDataStudy] = useState<StudyType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [selectedStudy, setSelectedStudy] = useState<StudyType>(null)

  const { width: screenWidth } = useWindowDimensions()

  const getDataStudyHistory = ({
    newFirst = true,
    currentDoctorOnly = false,
    withOrder = undefined,
    inputContent = ''
  }) => {
    let api = '/profile/doctor/studies'
    let url = api + `?patient_id=${patientId}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withOrder === undefined ? '' : `&withOrder=${withOrder}`}&description=${inputContent}
    `
    setLoading(true)
    setSelectedStudy(null)
    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          setDataStudy(res.data.items)
        } else if (res.status === 204) {
          setDataStudy([])
        }
      })
      .catch((error) => {
        setError(error)
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el historial de estudios' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT_SERVICE_REQUEST_HISTORY.FAILURE_GET,
          tags
        )
      })
      .finally(() => setLoading(false));
  }

  const debounce = useCallback(
    _.debounce(_inputContent => {
      getDataStudyHistory({
        newFirst: newFirst,
        currentDoctorOnly: currentDoctor,
        withOrder: withOrder,
        inputContent: _inputContent
      })
    }, 500),
    [currentDoctor, newFirst, withOrder]
  )

  useEffect(() => {
    if (!show) return
    getDataStudyHistory({
      newFirst: true,
      currentDoctorOnly: false,
      withOrder: undefined,
      inputContent: inputContent
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  useEffect(() => {
    //reset selected study
    setSelectedStudy(null)
  }, [dataStudy])

  return (
    <Transition
      show={show}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-col px-5 w-full'>
        {/* Head */}
        <button
          className='flex flex-row items-center mb-2 h-11 max-w-max-content focus:outline-none'
          onClick={() => {
            setShow(false)
          }}
        >
          <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
        </button>

        {/* title study history */}
        <div className='flex justify-start h-auto mb-1'>
          <div className='text-black font-bold text-2xl'>
            Listado de Estudios
            <div className='text-cool-gray-400 font-normal text-xl'>
              Estudios solicitados y resultados
            </div>
          </div>
        </div>

        {/* input search */}
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
              placeholder='Busqueda de estudios'
              title='Escriba aquí'
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
            setFilterAuthor={setCurrentDoctor}
            setFilterOrderStudy={setWithOrder}
            setFilterSequence={setNewFirst}
            getApiCall={getDataStudyHistory}
            inputContent={inputContent}
          />
        </div>
        {/* body */}
        <div className='flex flex-row overflow-x-visible' style={{ minWidth: '720px' }}>
          <div className="flex flex-col w-80 px-4 py-2 overflow-y-auto overflow-x-hidden scrollbar"
            style={{
              height: `calc(100vh - ${WIDTH_XL > screenWidth ? 385 : 287}px)`,
              minWidth: '280px'
            }}>

            {loading &&
              <div className='flex flex-row h-52 items-center justify-center'>
                <SpinnerLoading />
              </div>}


            {!loading &&
              dataStudy.map(study =>
                <CardStudy
                  key={`order_${study.id}}`}
                  study={study}
                  isSelectecStudy={selectedStudy?.id === study?.id}
                  setSelectedStudy={setSelectedStudy}
                />
              )}
          </div>
          <div className="flex flex-col px-4 py-2 gap-1 overflow-y-auto overflow-x-hidden scrollbar lg:w-full"
            style={{
              minWidth: '420px',
              height: `calc(100vh - ${WIDTH_XL > screenWidth ? 380 : 287}px)`,
            }}>

            {!loading && dataStudy.length === 0 &&
              <div className='flex w-full h-80 items-center justify-center text-gray-200 font-bold text-3xl'>
                No se han encontrado estudios
              </div>
            }

            {dataStudy.length > 0 && <CardDetailStudy selectedStudy={selectedStudy} />}
          </div>
        </div>
      </div>

    </Transition >
  )
}

export const QueryFilter = ({
  currentDoctor = {} as { id: string; name: string; lastName: string },
  getApiCall,
  inputContent,
  setFilterAuthor,
  setFilterOrderStudy,
  setFilterSequence,
}) => {
  //Current Doctor or all Doctors true: current | false: all
  const [author, setAuthor] = useState(false)
  //Asc or Desc [ 'false' || 'true' ]
  const [sequence, setSequence] = useState(true)
  //true withOrder | false withoutOrder | undefined all
  const [orderStudy, setOrderStudy] = useState(undefined)

  const ORDER_STATE = {
    order: true === orderStudy,
    withoutOrder: false === orderStudy,
    all: undefined === orderStudy
  }

  const AUTHOR_STATE = {
    current: true === author,
    all: false === author,
  }

  const SEQUENCE_STATE = {
    asc: false === sequence,
    desc: true === sequence,
  }

  const onClickWithOrder = () => {
    setOrderStudy(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: true,
      inputContent: inputContent
    })
  }

  const onClickWithoutOrder = () => {
    setOrderStudy(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: false,
      inputContent: inputContent
    })
  }

  const onClickAllOrder = () => {
    setOrderStudy(undefined)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: undefined,
      inputContent: inputContent
    })
  }

  const onClickCurrentDoctor = () => {
    setAuthor(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: true,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickAllDoctor = () => {
    setAuthor(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: false,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickSequenceAsc = () => {
    setSequence(false)
    getApiCall({
      newFirst: false,
      currentDoctorOnly: author,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickSequenceDesc = () => {
    setSequence(true)
    getApiCall({
      newFirst: true,
      currentDoctorOnly: author,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }
  useEffect(() => {
    setFilterSequence(sequence)
    setFilterAuthor(author)
    setFilterOrderStudy(orderStudy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence, author, orderStudy])

  return (
    <Popover className='relative'>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of the chevron icon. */
        <>
          <Popover.Button className='focus:outline-none' title='Filtros'>
            <FilterListIcon active={open} />
          </Popover.Button>
          <Popover.Panel className='absolute left-10 z-10 mt-3 -translate-x-1/2 transform px-4 w-72'>
            <div
              className='flex flex-col bg-blue-100 p-3 rounded-2xl shadow-xl gap-3'
              style={{ backgroundColor: '#EDF2F7' }}
            >
              <div className='flex flex-col'>
                <div className='font-semibold text-gray-500 mb-1'>Estudio Subido</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${ORDER_STATE['order'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl focus:outline-none`}
                    onClick={() => onClickWithOrder()}
                  >
                    <OrderWithIcon className='mr-1' active={ORDER_STATE['order']} />
                    <div className={`font-semibold ${ORDER_STATE['order'] && 'text-primary-500'}`}>
                      Con orden asociado
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${ORDER_STATE['withoutOrder'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3`}
                    onClick={() => onClickWithoutOrder()}
                  >
                    <OrderWithoutIcon className='mr-1' active={ORDER_STATE['withoutOrder']} />
                    <div className={`font-semibold ${ORDER_STATE['withoutOrder'] && 'text-primary-500'}`}>
                      Sin orden asociada
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center justify-center gap-2 cursor-pointer focus:outline-none ${ORDER_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickAllOrder()}
                  >
                    <div className={`font-semibold ${ORDER_STATE['all'] && 'text-primary-500'}`}>
                      Todos
                    </div>
                  </button>
                </div>
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


type PropsCardStudy = {
  study?: StudyType,
  isSelectecStudy?: boolean,
  setSelectedStudy?: (study: StudyType) => void
}

const CardStudy: React.FC<PropsCardStudy> = (
  {
    study,
    isSelectecStudy,
    setSelectedStudy,
    ...props
  }
) => {

  const getMessageSource = () => {
    if (study?.type === STUDY_TYPE.WITH_ORDER) {
      return `Solicitado por Dr. Dra. ${study.sourceName}`
    } else if (study.type === STUDY_TYPE.WITHOUT_ORDER) {
      if (study?.sourceType === SOURCE_TYPE_STUDY.patient)
        return `Subido por el paciente ${study?.sourceName ?? ''}`
      if (study?.sourceType === SOURCE_TYPE_STUDY.practitioner)
        return `Subido por ${study?.sourceName ?? ''}`
      if (study?.sourceType === SOURCE_TYPE_STUDY.organization)
        return `Subido por la organización ${study?.sourceName ?? ''}`
      return `Subido por ${study?.sourceName ?? ''}`
    }
  }

  return (
    <div className={`flex flex-col p-2 group ${isSelectecStudy ? 'bg-bluish-500' : 'hover:bg-neutral-gray'} rounded-lg`}
      style={{
        width: '250px',
        height: '171px',
        gap: '10px',
        transition: 'background-color 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={() => { setSelectedStudy(study) }}
    >
      {/* Head */}
      <div className='flex flex-row items-center gap-2'>
        <LabIcon width={27} height={27} />
        <h2 className='text-cool-gray-700 font-normal'
          style={{ fontSize: '20px' }}
        >{study?.category}</h2>
      </div>


      {/* Studies added */}
      {study?.type === STUDY_TYPE.WITH_ORDER ?
        <div className={`flex flex-row px-1 py-2 text-dark-cool text-sm 
      ${isSelectecStudy ? 'bg-primary-100 text-green-darker' :
            'bg-ghost-white group-hover:bg-primary-100 group-hover:text-green-darker'} items-center`} style={{
              width: '164px',
              height: '26px',
              borderRadius: '1000px',
              lineHeight: '16px',
              letterSpacing: '0.1px',
              transition: 'background-color 0.3s ease-out, color 0.3s ease-out'

            }}>
          {`${study?.diagnosticReportAttachmentCount} resultados añadidos`}
        </div> :
        <div className={`flex flex-row px-1 py-2 text-gray-500 text-sm items-center 
        ${isSelectecStudy ? 'text-green-darker' : 'group-hover:text-green-darker'}`} style={{
            width: '164px',
            height: '26px',
            lineHeight: '16px',
            letterSpacing: '0.1px',
            transition: 'background-color 0.3s ease-out, color 0.3s ease-out'

          }}>
          Sin orden asociada
        </div>
      }

      {/* study container */}
      <div className='flex flex-col gap-1 w-56'>
        <div className='w-56 truncate text-dark-cool font-semibold text-sm'
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
          title={study?.description}
        >
          {study?.description}
        </div>
        <div className='w-56 truncate font-normal text-xs text-dark-cool'
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
          title={getMessageSource()}
        >
          {getMessageSource()}
        </div>
      </div>

      {/* Footer */}
      <div className='flex flex-row gap-2 h-4'>
        <div className='text-dark-cool text-sm '
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {moment(study.authoredDate).format('DD/MM/YYYY')}
        </div>
        <div className='text-gray-500'
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {countDays(study.authoredDate)}
        </div>
      </div>
      <span style={{ borderBottom: '2px solid #F7F4F4' }}></span>
    </div>
  )
}


type PropsDetailStudy = {
  selectedStudy: StudyType
}

const CardDetailStudy: React.FC<PropsDetailStudy> = ({
  selectedStudy
}) => {

  const { addToast } = useToasts()

  const [studyOrder, setStudyOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  //const [studyResult, setStudyResult] = useState()

  //const getDiagnosticReport = (id:string) => {}

  const getServiceRequest = (id) => {
    let url = '/profile/doctor/serviceRequest/' + id
    setLoading(true)
    axios.get(url)
      .then(res => {
        setStudyOrder(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        setError(error)
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el detalle de la orden' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET,
          tags
        )
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!selectedStudy) return
    if (selectedStudy.type === 'serviceRequest')
      getServiceRequest(selectedStudy.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudy])

  if (loading) return (
    <div className='flex flex-col'>
      <div className='flex flex-row w-full h-80 justify-center items-center'>
        <SpinnerLoading />
      </div>
    </div>
  )

  if (!selectedStudy) return (
    <div className='flex w-full h-80 items-center justify-center text-gray-200 font-bold text-3xl'>
      Seleccione un estudio para mostrar

    </div>
  )

  if (selectedStudy.type === 'serviceRequest') {

    let doctor = studyOrder?.doctor

    const getDoctor = (givenName = '', familyName = '', gender = '', specializations = []) => {

      let doctorName = `${gender === 'male' ? 'Dr.' : 'Dra.'} ${toUpperLowerCase(givenName.split(' ')[0] + ' ' + familyName.split(' ')[0])}`

      return (
        <div className='flex flex-col'>
          <div className='text-cool-gray-700' style={{ lineHeight: '16px' }}>
            {doctorName}
          </div>
          {/* Specialty and organization */}
          <div className='flex flex-row gap-1'>
            <div className='text-xs w-96 truncate' style={{ color: '#718096', lineHeight: '16px' }}
              title={specializations.map(spe => spe.description).join(' ⦁ ')}
            >
              {specializations.map(spe => spe.description).join(' ⦁ ')}
            </div>
          </div>
        </div>
      )
    }

    const getCategorySvg = (category = '') => {
      return category === 'Laboratory' ? <LabIcon width={18} height={18} /> :
        category === 'Diagnostic Imaging' ? <ImgIcon width={18} height={18} /> :
          category === 'Other' ? <OtherIcon width={18} height={18} /> : 'Sin categoria'
    }

    const getCategoryLabel = (category = '') => {
      return category === 'Laboratory' ? 'Laboratorio' :
        category === 'Diagnostic Imaging' ? 'Imágenes' :
          category === 'Other' ? 'Otros' : 'Sin categoria'
    }

    const getStudies = (studies = []) => {
      return studies.map(x => (
        <li className='text-cool-gray-700 text-sm'>{x.display}</li>
      ))
    }


    return (
      <>
        {/* Order Header */}
        <div className='flex flex-col p-2 gap-1'>
          <h1 className='font-semibold text-gray-500 text-xs'>Orden</h1>
          {/* Doctor picture */}
          <div className='flex flex-row gap-4 w-64 h-11 items-center'>
            {doctor?.photoUrl ? (
              <img
                src={doctor?.photoUrl}
                alt='Foto de Perfil'
                className='flex-none border-1 border-white w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-10 h-10' />
            )}
            {/* Doctor info */}
            {doctor && getDoctor(doctor.givenName, doctor.familyName, doctor.gender, doctor.specializations)}
          </div>
          {/* <div className='flex flex-row justify-end w-full'>
            <a href='#a' className='text-orange-dark border-b border-orange-dark focus:outline-none text-sm'>
              Ver consulta origen
            </a>
          </div> */}
          <div className='font-semibold text-gray-500 text-xs'>Solicitado en fecha</div>
          <div className='flex flex-row items-center'>
            <CalendarIcon />
            <div className='text-cool-gray-700' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
              {moment(studyOrder?.authoredDate).format('DD/MM/YYYY')}
            </div>
            <div className='ml-2 text-gray-500'>
              {countDays(studyOrder?.authoredDate)}
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {studyOrder?.diagnosis &&
          <div className='flex flex-col gap-1'>
            <div className='text-primary-500'>
              Impresión diagnóstica
            </div>
            <div className='font-semibold' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
              {studyOrder?.diagnosis}
            </div>
          </div>
        }

        {/* Requested studies */}
        <div className='flex flex-col gap-2 mt-3'>
          <div className='text-primary-500'>
            Estudios solicitados
          </div>
          <div className='flex flex-col p-3' style={{ border: '3px solid #F6F4F4', borderRadius: '16px' }}>
            {/* Header Study */}
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row gap-2'>
                {getCategorySvg(studyOrder?.category)}
                <div className='text-cool-gray-700 text-sm' style={{ lineHeight: '20px' }}>
                  {getCategoryLabel(studyOrder?.category)}
                </div>
              </div>
              <div className='flex flex-row justify-center'
                style={{
                  padding: '1px 6px',
                  width: '54px',
                  height: '18px',
                  background: '#E8431F',
                  borderRadius: '4px'
                }}>
                <span className='font-semibold text-white' style={{
                  fontSize: '10px',
                  lineHeight: '16px',
                  letterSpacing: '0.5px'
                }}>urgente</span>
              </div>
            </div>
            {/* Body Study */}
            <div className='flex flex-row pt-1'>
              <ul className="list-disc list-inside ml-2 pt-2">
                {getStudies(studyOrder?.studiesCodes)}
              </ul>
            </div>
            {/* Observation */}
            {studyOrder?.notes &&
              <div className='flex flex-col mt-2'>
                <div className='text-sm text-cool-gray-700'>Observaciones:</div>
                <div className='text-sm text-cool-gray-700'>
                  {studyOrder?.notes}
                </div>
              </div>
            }

            {/* added results*/}
            {/* <div className='flex flex-col mt-3'>
              <div className='text-sm text-cool-gray-700 mb-2'>Resultados añadidos</div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col w-full h-16 bg-bluish-500 rounded-lg  py-3 px-3 gap-2'>
                  <div className='flex flex-row'>
                    <div className='flex flex-row gap-1 items-center'>
                      <PdfIcon width={20} height={20} />
                      <a className='ml-1 w-40 sm:w-40 md:w-40 lg:w-full font-medium text-sm truncate'
                        href='#a'
                        style={{
                          lineHeight: '17px',
                          color: '#424649'
                        }}>
                        informe_de_estudio_Asd_Asda_Asdasd.pdf
                      </a>
                      <ChevronRight width={6} height={9} />
                    </div>
                    <div className='flex flex-row flex-1 items-center justify-end pr-4 gap-3'>
                      <button className='focus:outline-none'>
                        <EyeIcon width={18} height={12} />
                      </button>
                      <button className='focus:outline-none'>
                        <ArrowDownWardIcon width={13} height={13} />
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <span
                      style={{
                        fontSize: '11px',
                        lineHeight: '16px',
                        letterSpacing: '0.1px'
                      }}
                    >Subido por el paciente</span>
                    <span
                      className='text-dark-cool'
                      style={{
                        fontSize: '11px',
                        lineHeight: '16px',
                        letterSpacing: '0.1px'
                      }}>10/11/2022 14:06:56</span>
                  </div>
                </div>

                <div className='flex flex-col w-full h-16 bg-bluish-500 rounded-lg  py-3 px-3 gap-2'>
                  <div className='flex flex-row'>
                    <div className='flex flex-row gap-1 items-center'>
                      <PictureIcon width={18} height={18} />
                      <a className='ml-1 w-40 sm:w-40 md:w-40 lg:w-full font-medium text-sm truncate'
                        href='#a'
                        style={{
                          lineHeight: '17px',
                          color: '#424649'
                        }}>
                        informe_de_estudio_Asd_Asda_Asdasd.pdf
                      </a>
                      <ChevronRight width={6} height={9} />
                    </div>
                    <div className='flex flex-row flex-1 items-center justify-end pr-4 gap-3'>
                      <button className='focus:outline-none'>
                        <EyeIcon width={18} height={12} />
                      </button>
                      <button className='focus:outline-none'>
                        <ArrowDownWardIcon width={13} height={13} />
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-row gap-2'>
                    <span
                      style={{
                        fontSize: '11px',
                        lineHeight: '16px',
                        letterSpacing: '0.1px'
                      }}
                    >Subido por el paciente</span>
                    <span
                      className='text-dark-cool'
                      style={{
                        fontSize: '11px',
                        lineHeight: '16px',
                        letterSpacing: '0.1px'
                      }}>10/11/2022 14:06:56</span>
                  </div>
                </div>
              </div>
            </div> */}
            <AddedResults diagnosticReports={studyOrder?.diagnosticReports ?? []} />
          </div>


          {/* no study order */}
          {/* <div className='flex flex-col'>
            <div className='text-primary-500'>
              Origen
            </div>
            <span className='font-semibold'>
              Subido por el paciente
            </span>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex flex-row items-center gap-2'>
              <PaperClipIcon />
              <h2 className='text-cool-gray-700 font-medium text-xl'>Adjuntos</h2>
            </div>
            <div className='flex flex-col w-full h-16 bg-bluish-500 rounded-lg  py-3 px-3 gap-2'>
              <div className='flex flex-row'>
                <div className='flex flex-row gap-1 items-center'>
                  <PictureIcon width={18} height={18} />
                  <a className='ml-1 w-40 sm:w-40 md:w-40 lg:w-full font-medium text-sm truncate'
                    href='#a'
                    style={{
                      lineHeight: '17px',
                      color: '#424649'
                    }}>
                    informe_de_estudio_Asd_Asda_Asdasd.pdf
                  </a>
                  <ChevronRight width={6} height={9} />
                </div>
                <div className='flex flex-row flex-1 items-center justify-end pr-4 gap-3'>
                  <button className='focus:outline-none'>
                    <EyeIcon width={18} height={12} />
                  </button>
                  <button className='focus:outline-none'>
                    <ArrowDownWardIcon width={13} height={13} />
                  </button>
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                <span
                  style={{
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.1px'
                  }}
                >Subido por el paciente</span>
                <span
                  className='text-dark-cool'
                  style={{
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '0.1px'
                  }}>10/11/2022 14:06:56</span>
              </div>
            </div>
          </div> */}
        </div>
      </>
    )
  }
}


type AttachmentUrlType = {
  contentType: string;
  title: string;
  url: string;
}

type DiagnosticReportType = {
  attachmentNumber: string;
  attachmentUrls: AttachmentUrlType[];
  category: string;
  description: string;
  effectiveDate: string;
  id: string;
  patientId: string;
  source: string;
  sourceID: string;
  sourceType: string;
}

type CardAttachedProps = {
  fileData: AttachmentUrlType,
  effectiveDate: string;
  sourceType: string
}

const CardAttached: React.FC<CardAttachedProps> = ({ fileData, ...props }) => {

  const { addToast } = useToasts()

  const [loadingDownload, setLoadingDownload] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState<AttachmentUrlType>()

  const getIconFile = (type: string) => {
    if (!type) return
    if (type.includes('image')) return <PictureIcon width={18} height={18} />
    if (type === 'application/pdf') return <PdfIcon width={20} height={20} />
  }

  const getOrigin = (sourceType) => {
    if (!sourceType) return
    if (sourceType === 'Patient')
      return 'Subido por el paciente'
    if (sourceType === 'Practitioner')
      return 'Subido por un Doctor'
    if (sourceType === 'Organization')
      return 'Subido por la organización'
  }

  const getDateOrigin = (date) => {
    if (!date) return
    return moment(date).format('DD/MM/YYYY  HH:MM:SS')
  }

  const downloadBlob = (url, title, contentType) => {
    setLoadingDownload(true)
    const oReq = new XMLHttpRequest();
    oReq.open('GET', url, true);
    oReq.responseType = 'blob';

    oReq.onload = function () {
      if (oReq.status === 200) {
        const file = new Blob([oReq.response], { type: contentType });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = title;
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(fileURL);
          document.body.removeChild(a);
        }, 0);
      } else {
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al descargar el archivo. Inténtalo luego más tarde' })
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        handleSendSentry(oReq.onerror, 'Ha ocurrido un error al descargar el archivo', tags)
      }
      setLoadingDownload(false)
    };
    oReq.send();

  };

  return <div className='flex flex-col w-full h-16 bg-bluish-500 rounded-lg  py-3 px-3 gap-2'>
    <div className='flex flex-row'>
      <div className='flex flex-row gap-1 items-center'>
        {getIconFile(fileData?.contentType)}
        <a className='ml-1 w-40 sm:w-40 md:w-40 lg:w-full font-medium text-sm truncate'
          href='#a'
          style={{
            lineHeight: '17px',
            color: '#424649'
          }}>
          {fileData.title}
        </a>
        <ChevronRight width={6} height={9} />
      </div>
      <div className='flex flex-row flex-1 items-center justify-end pr-4 gap-3'>
        <button className='focus:outline-none' onClick={() => {
          setShowModal(true)
          setPreview({ url: fileData.url, title: fileData.title, contentType: fileData.contentType })
        }}>
          <EyeIcon width={18} height={12} />
        </button>
        <button className='focus:outline-none' onClick={() => downloadBlob(fileData.url, fileData.title, fileData.contentType)}>
          {!loadingDownload && <ArrowDownWardIcon width={13} height={13} />}
          {loadingDownload && <Spinner className='text-gray-700 animate-spin w-4 h-4' />}
        </button>
      </div>
    </div>
    <div className='flex flex-row gap-2'>
      <span
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          letterSpacing: '0.1px'
        }}
      >{getOrigin(props.sourceType)}</span>
      <span
        className='text-dark-cool'
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          letterSpacing: '0.1px'
        }}>{getDateOrigin(props.effectiveDate)}</span>
    </div>

    <Modal show={showModal} size='xl5' setShow={setShowModal} noPadding={true}>
      <div className='w-full p-1'>
        <div className='flex flew-row h-5 w-full justify-end mb-2'>
          <button className='focus:outline-none' onClick={() => setShowModal(false)}>
            <CloseIcon className='focus:outline-none'></CloseIcon>
          </button>
        </div>
        {preview &&
          preview.contentType.includes('pdf') ?
          <object className='w-full' data={preview.url} width="700" height="700" type="application/pdf" aria-labelledby={preview.title}></object> : preview &&
          <img className='w-full' src={preview.url} alt="img" />}
      </div>
    </Modal>
  </div>
}

type PropsResults = {
  diagnosticReports: DiagnosticReportType[]
}

const AddedResults: React.FC<PropsResults> = ({ diagnosticReports }) => {

  if (diagnosticReports?.length === 0)
    return <div className='text-sm text-cool-gray-700 mb-2 mt-3'>Aún no se han añadido resultados.</div>

  return <div className='flex flex-col mt-3'>
    <div className='text-sm text-cool-gray-700 mb-2'>Resultados añadidos</div>
    <div className='flex flex-col gap-2'>
      {diagnosticReports.map((data, idx) =>
        data.attachmentUrls.map((fileData, idy) => {
          return <CardAttached
            key={idx + idy}
            fileData={fileData}
            effectiveDate={data.effectiveDate}
            sourceType={data.sourceType} />
        })
      )}
    </div>
  </div>
}

export default StudyHistory