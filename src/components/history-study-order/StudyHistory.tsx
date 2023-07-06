import { Transition } from '@headlessui/react'
import axios, { AxiosError } from 'axios'
import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import loadGif from '../../assets/loading.gif'
import { ReactComponent as SpinnerLoading } from '../../assets/spinner-loading.svg'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { WIDTH_XL } from '../../util/constants'
import useWindowDimensions from '../../util/useWindowDimensions'
import { CardStudy } from './CardStudy'
import { QueryFilter } from './QueryFilter'
import ArrowBackIOS from '../icons/ArrowBack-ios'
import SearchIcon from '../icons/SearchIcon'
import ImgIcon from '../icons/studies-category/ImgIcon'
import LabIcon from '../icons/studies-category/LabIcon'
import OtherIcon from '../icons/studies-category/OtherIcon'
import { CardDetailStudy } from './CardDetailStudy'

export type StudyType = {
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

export type scrollParams = {
  total: number,
  page: number,
  count: number,
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

  //const { addToast } = useToasts()

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
  const [error, setError] = useState<AxiosError>()

  const [selectedStudy, setSelectedStudy] = useState<StudyType>(null)

  const { width: screenWidth } = useWindowDimensions()

  // scroll loading
  const [loadingScroll, setLoadingScroll] = useState(false)

  // reference to listen to scroll event
  const scrollEvent = useRef<HTMLDivElement>()
  const [pageParams, setPageParams] = useState<scrollParams>({
    total: 0,
    page: 1,
    count: 10 //total number of results viewed
  })

  const getDataStudyHistory = ({
    newFirst = true,
    currentDoctorOnly = false,
    withOrder = undefined,
    inputContent = '',
    count = pageParams.count,
    page = 1,
  }) => {
    let api = '/profile/doctor/studyResults'
    let url = api + `?patient_id=${patientId}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withOrder === undefined ? '' : `&withOrder=${withOrder}`}&description=${inputContent}&count=${count}&page=${page}
    `
    setLoading(true)
    setSelectedStudy(null)
    setError(null)
    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          setDataStudy(res.data.items)
          setPageParams({ total: res.data.total, page, count })
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
        //addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el historial de estudios' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT_SERVICE_REQUEST_HISTORY.FAILURE_GET,
          tags
        )
      })
      .finally(() => {
        setLoading(false)
      });
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

  const getDataStudyHistoryScroll = ({
    newFirst = true,
    currentDoctorOnly = false,
    withOrder = undefined,
    inputContent = '',
    count = pageParams.count,
    page = 1,
  }) => {
    let api = '/profile/doctor/studyResults'
    let url = api + `?patient_id=${16336}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withOrder === undefined ? '' : `&withOrder=${withOrder}`}&description=${inputContent}&count=${count}&page=${page}
    `
    setLoadingScroll(true)
    setError(null)
    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          setDataStudy([...dataStudy, ...res.data.items])
          setPageParams({ total: res.data.total, page, count })
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
        //addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el historial de estudios' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT_SERVICE_REQUEST_HISTORY.FAILURE_GET,
          tags
        )
      })
      .finally(() => {
        setLoadingScroll(false)
      });
  }

  const onScrollEnd = () => {
    if (loading) return
    if (pageParams.page + 1 > Math.ceil(pageParams.total / pageParams.count)) return
    if (scrollEvent.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollEvent.current
      if (Math.trunc(scrollTop + clientHeight) === scrollHeight) {
        // TO SOMETHING HERE
        getDataStudyHistoryScroll({
          newFirst: newFirst,
          count: pageParams.count,
          inputContent: inputContent,
          currentDoctorOnly: currentDoctor,
          page: pageParams.page + 1,
          withOrder: withOrder
        })
      }
    }
  }

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

  // useEffect(() => {
  //   //reset selected study
  //   setSelectedStudy(null)
  // }, [dataStudy])

  if (error)
    return <Transition
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
        {/* body */}
        <div className='flex flex-row w-full justify-center items-center mt-52' style={{ minWidth: '720px' }}>
          <div className='flex flex-col justify-center items-center w-full gap-1'>
            <div className='font-bold'>
              Ha ocurrido un error al traer el historial de estudios.
            </div>
            <button
              className='px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2'
              onClick={() => getDataStudyHistory({
                newFirst: true,
                currentDoctorOnly: false,
                withOrder: undefined,
                inputContent: inputContent
              })}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    </Transition >

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
        <div className='flex flex-row overflow-x-visible overflow-y-hidden relative' style={{ minWidth: '720px' }}>
          <div className="flex flex-col w-80 px-4 py-2 overflow-y-auto overflow-x-hidden scrollbar"
            style={{
              height: `calc(100vh - ${WIDTH_XL > screenWidth ? 385 : 287}px)`,
              minWidth: '280px'
            }}
            ref={scrollEvent}
            onScroll={() => onScrollEnd()}
          >

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

            {!loading && dataStudy.length === 0 && !error &&
              <div className='flex w-full h-80 items-center justify-center text-gray-200 font-bold text-3xl'>
                No se han encontrado estudios
              </div>
            }
            {dataStudy.length > 0 && <CardDetailStudy selectedStudy={selectedStudy} />}
          </div>
          <img
            className={`${!loadingScroll && 'hidden'} absolute w-15 h-15 z-50`}
            src={loadGif}
            alt='loading gif'
            style={{ bottom: '-1rem', left: '6rem' }}
          />
        </div>
      </div>

    </Transition >
  )
}

export const getCategorySvg = (category = '', width = 18, height = 18, hoverDarkMode = false) => {
  if (!category) return
  switch (category.toLowerCase()) {
    case 'laboratory':
    case 'laboratorio':
      return <LabIcon hoverDarkMode={hoverDarkMode} width={width} height={height} />;
    case 'other':
    case 'otros':
      return <OtherIcon hoverDarkMode={hoverDarkMode} width={width} height={height} />;
    case 'image':
    case 'diagnostic imaging':
    case 'imágen':
      return <ImgIcon hoverDarkMode={hoverDarkMode} width={width} height={height} />;
  }
};

export const getOrigin = (sourceType = '') => {
  if (!sourceType) return
  switch (sourceType.toLowerCase()) {
    case 'patient':
      return 'Subido por el paciente';
    case 'practitioner':
      return 'Subido por un Doctor';
    case 'organization':
      return 'Subido por la organización';
  }
};

export default StudyHistory