import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import loadGif from '../../assets/loading.gif';
import { ReactComponent as SpinnerLoading } from '../../assets/spinner-loading.svg';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { WIDTH_XL } from '../../util/constants';
import useWindowDimensions from '../../util/useWindowDimensions';
import { AppointmentWithPatient } from '../RecordsOutPatient';
import { stylePanelSidebar } from '../SidebarMenuCall';
import CloseButton from '../icons/CloseButton';
import SearchIcon from '../icons/SearchIcon';
import { CardStudy } from './CardStudy';
import { QueryFilter } from './QueryFilter';
import { StudyType, scrollParams } from './StudyHistory';
import ArrowBackIOS from '../icons/ArrowBack-ios';
import { CardDetailStudy } from './CardDetailStudy';
import { useToasts } from '../Toast';

type StudyHistoryCallType = {
  appointment: AppointmentWithPatient;
  studyHistoryButton: boolean,
  containerRef: MutableRefObject<HTMLDivElement>,
  handleSidebarHoverOff: () => void,
  setStudyHistoryButton: (value: boolean) => void,
}

/**
 * Study History Call component
 */
export const StudyHistoryCall: React.FC<StudyHistoryCallType> = ({
  appointment,
  containerRef,
  studyHistoryButton,
  setStudyHistoryButton,
  handleSidebarHoverOff,
}) => {

  //current doctor
  let doctor = {
    id: appointment?.doctorId,
    name: appointment?.doctor.givenName.split(' ')[0],
    lastName: appointment?.doctor.familyName.split(' ')[0],
  }

  const patientId = appointment.patientId

  // list of study
  const [dataStudy, setDataStudy] = useState<StudyType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()

  const [selectedStudy, setSelectedStudy] = useState<StudyType>(null)


  // reference to listen to scroll event
  const scrollEvent = useRef<HTMLDivElement>()
  const [pageParams, setPageParams] = useState<scrollParams>({
    total: 0,
    page: 1,
    count: 10 //total number of results viewed
  })

  // Scroll Trigger loading
  const [loadingScroll, setLoadingScroll] = useState(false)

  const { width: screenWidth } = useWindowDimensions()

  //states filters
  const [inputContent, setInputContent] = useState('')
  const [currentDoctor, setCurrentDoctor] = useState(false)
  const [newFirst, setNewFirst] = useState(true)
  const [withOrder, setWithOrder] = useState(undefined) // true or false or undefined


  const { addToast } = useToasts()

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
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el historial de estudios' })
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
    let url = api + `?patient_id=${patientId}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withOrder === undefined ? '' : `&withOrder=${withOrder}`}&description=${inputContent}&count=${count}&page=${page}
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
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el historial de estudios' })
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
    if (!studyHistoryButton) {
      handleSidebarHoverOff()
      if (dataStudy.length === 0) {
        setInputContent('')
        setCurrentDoctor(false)
        setWithOrder(undefined)
      }
      return
    }
    if (studyHistoryButton && dataStudy.length === 0) {
      getDataStudyHistory({
        newFirst: true,
        currentDoctorOnly: false,
        withOrder: undefined,
        inputContent: inputContent
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyHistoryButton])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      let attachedModal = document.getElementById('attached_modal')
      if (!containerRef.current?.contains(event.target as Node)) {
        if (!dataStudy) return
        setStudyHistoryButton(false)
      } else if (attachedModal?.contains(event.target as Node)) {
        setStudyHistoryButton(true)
      }
    }
    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyHistoryButton])

  return (
    <div
      className={`opacity-0 ${studyHistoryButton && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
      style={{ width: studyHistoryButton ? '26rem' : '0px' }}
    >
      <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center justify-between'>
        <span className='text-white font-medium text-sm truncate'>Registro de consultas ambulatorias</span>
        <button className='focus:outline-none' onClick={() => {
          setStudyHistoryButton(false)
        }}>
          <CloseButton />
        </button>
      </div>
      <div className={`flex flex-col flex-1 p-2 items-center relative`} style={stylePanelSidebar}>
        <div className='flex flex-row flew-no-wrap w-full items-center'>
          {!selectedStudy &&
            <div className='w-full h-11 relative bg-cool-gray-50 rounded-lg mb-5 mt-5 mr-2'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <SearchIcon className='w-5 h-5' />
              </div>
              <input
                className='p-3 pl-10 w-full outline-none hover:bg-cool-gray-100 transition-colors delay-200 rounded-lg'
                type='search'
                name='search'
                placeholder='Busqueda de estudios'
                title='Escriba la descripción del estudio'
                autoComplete='off'
                value={inputContent}
                onChange={e => {
                  setInputContent(e.target.value)
                  debounce(e.target.value.trim())
                }}
              />
            </div>}

          {!selectedStudy &&
            <QueryFilter
              currentDoctor={doctor}
              setFilterAuthor={setCurrentDoctor}
              setFilterOrderStudy={setWithOrder}
              setFilterSequence={setNewFirst}
              getApiCall={getDataStudyHistory}
              inputContent={inputContent}
              darkMode={true}
            />}

        </div>
        {!selectedStudy && !error &&
          <div
            className={`flex flex-col overflow-x-hidden mx-1 scrollbar w-full ${loading && 'justify-center items-center'
              }`}
            style={{
              height: `calc(100vh - ${WIDTH_XL > screenWidth ? 230 : 170}px)`,
            }}
            ref={scrollEvent}
            onScroll={() => onScrollEnd()}
          >
            {loading && <SpinnerLoading />}
            {!loading &&
              dataStudy.map(study =>
                <CardStudy
                  key={`study_history_${study.id}}`}
                  study={study}
                  isSelectecStudy={selectedStudy?.id === study?.id}
                  setSelectedStudy={setSelectedStudy}
                  darkMode={true}
                />
              )}

            {!loading && dataStudy.length === 0 &&
              <div className='flex flex-row w-full justify-center items-center text-white font-bold'>
                No se encontraron resultados.
              </div>
            }
          </div>}
        <div className='flex flex-row justify-center w-full'>
          <img
            className={`${!loadingScroll && 'hidden'} absolute w-15 h-15 z-50`}
            src={loadGif}
            alt='loading gif'
            style={{ bottom: '0rem' }}
          />
        </div>

        {error && <div className='flex flex-col w-full h-full items-center justify-center'>
          <div className='mt-6 text-center sm:mt-5'>
            <h3 className='text-lg font-medium leading-6 text-white' id='modal-headline'>
              Ha ocurrido un error al traer los registros
            </h3>
          </div>
          <div className='flex justify-center w-full mt-6 sm:mt-8'>
            <button
              className='px-4 py-2 text-lg font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2'
              onClick={() => getDataStudyHistory({
                newFirst: true,
                currentDoctorOnly: false,
                withOrder: undefined,
                inputContent: inputContent
              })}
            >
              Inténtar de nuevo
            </button>
          </div>
        </div>}


        {selectedStudy && !error &&
          <div className='flex flex-col flex-no-wrap w-full flex-1'>
            <div className="flex flex-row flex-no-wrap items-start">
              <button className='flex flex-row text-white focus:outline-none justify-center items-center gap-1' onClick={() => setSelectedStudy(null)}>
                <ArrowBackIOS fill='#FFFFFF' style={{
                  margin: '0 auto',
                  transform: 'scale(.7)',
                }} /> atrás
              </button>
            </div>
            <div
              className={`flex flex-col w-full overflow-y-auto scrollbar mt-5`}
              style={{
                height: `calc(100vh - ${WIDTH_XL > screenWidth ? 195 : 125}px)`,
              }}
            >
              {dataStudy.length > 0 && <CardDetailStudy key={'study_card_detail'} selectedStudy={selectedStudy} darkMode={true} />}
            </div>
          </div>
        }
      </div>
    </div>
  )
}