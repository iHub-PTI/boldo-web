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
import ArrowBackIOS from '../icons/ArrowBack-ios';
import CloseButton from '../icons/CloseButton';
import SearchIcon from '../icons/SearchIcon';
import { CardDetailStudy } from './CardDetailStudy';
import { CardStudy } from './CardStudy';
import { QueryFilterOrder } from './QueryFilter';
import { StudyType, scrollParams } from './StudyHistory';
// import { useToasts } from '../Toast';

type OrderHistoryCallType = {
  appointment: AppointmentWithPatient;
  orderHistoryButton: boolean,
  containerRef: MutableRefObject<HTMLDivElement>,
  handleSidebarHoverOff: () => void,
  setOrderHistoryButton: (value: boolean) => void,
}

/**
 * Study History Call component
 */
export const OrderHistoryCall: React.FC<OrderHistoryCallType> = ({
  appointment,
  containerRef,
  orderHistoryButton,
  setOrderHistoryButton,
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
  const [dataOrders, setDataOrders] = useState<StudyType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()

  const [selectedOrder, setSelectedOrder] = useState<StudyType>(null)


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
  const [withResult, setWithResult] = useState(undefined)  // true or false or undefined


  //const { addToast } = useToasts()

  const getDataOrderHistory = ({
    newFirst = true,
    currentDoctorOnly = false,
    withResult = undefined,
    inputContent = '',
    count = pageParams.count,
    page = 1,
  }) => {
    let api = '/profile/doctor/studyOrders'
    let url = api + `?patient_id=${patientId}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withResult === undefined ? '' : `&withResult=${withResult}`}&description=${inputContent}&count=${count}&page=${page}
    `
    setLoading(true)
    setSelectedOrder(null)
    setError(null)
    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          setDataOrders(res.data.items)
          setPageParams({ total: res.data.total, page, count })
        } else if (res.status === 204) {
          setDataOrders([])
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
          ERROR_HEADERS.DIAGNOSTIC_REPORT_SERVICE_REQUEST_HISTORY.FAILURE_GET_ORDER_HISTORTY,
          tags
        )
      })
      .finally(() => {
        setLoading(false)
      });
  }

  const debounce = useCallback(
    _.debounce(_inputContent => {
      getDataOrderHistory({
        newFirst: newFirst,
        currentDoctorOnly: currentDoctor,
        withResult: withResult,
        inputContent: _inputContent
      })
    }, 500),
    [currentDoctor, newFirst, withResult]
  )

  const getDataOrderHistoryScroll = ({
    newFirst = true,
    currentDoctorOnly = false,
    withResult = undefined,
    inputContent = '',
    count = pageParams.count,
    page = 1,
  }) => {
    let api = '/profile/doctor/studyOrders'
    let url = api + `?patient_id=${16336}&newFirst=${newFirst}&currentDoctorOnly=${currentDoctorOnly}${withResult === undefined ? '' : `&withResult=${withResult}`}&description=${inputContent}&count=${count}&page=${page}
    `
    setLoadingScroll(true)
    setError(null)
    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          setDataOrders([...dataOrders, ...res.data.items])
          setPageParams({ total: res.data.total, page, count })
        } else if (res.status === 204) {
          setDataOrders([])
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
          ERROR_HEADERS.DIAGNOSTIC_REPORT_SERVICE_REQUEST_HISTORY.FAILURE_GET_ORDER_HISTORTY,
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
        getDataOrderHistoryScroll({
          newFirst: newFirst,
          count: pageParams.count,
          inputContent: inputContent,
          currentDoctorOnly: currentDoctor,
          page: pageParams.page + 1,
          withResult: withResult
        })
      }
    }
  }


  useEffect(() => {
    if (!orderHistoryButton) {
      handleSidebarHoverOff()
      if (dataOrders.length === 0) {
        setInputContent('')
        setCurrentDoctor(false)
        setWithResult(undefined)
      }
      return
    }
    if (orderHistoryButton && dataOrders.length === 0) {
      getDataOrderHistory({
        newFirst: true,
        currentDoctorOnly: false,
        withResult: undefined,
        inputContent: inputContent
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderHistoryButton])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      let attachedModal = document.getElementById('attached_modal')
      if (!containerRef.current?.contains(event.target as Node)) {
        if (!dataOrders) return
        setOrderHistoryButton(false)
      } else if (attachedModal?.contains(event.target as Node)) {
        setOrderHistoryButton(true)
      }
    }
    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderHistoryButton])

  return (
    <div
      className={`opacity-0 ${orderHistoryButton && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
      style={{ width: orderHistoryButton ? '26rem' : '0px' }}
    >
      <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center justify-between'>
        <span className='text-white font-medium text-sm truncate'>Registro de consultas ambulatorias</span>
        <button className='focus:outline-none' onClick={() => {
          setOrderHistoryButton(false)
        }}>
          <CloseButton />
        </button>
      </div>
      <div className={`flex flex-col flex-1 p-2 items-center relative`} style={stylePanelSidebar}>
        <div className='flex flex-row flew-no-wrap w-full items-center'>
          {!selectedOrder &&
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

          {!selectedOrder &&
            <QueryFilterOrder
              currentDoctor={doctor}
              setFilterAuthor={setCurrentDoctor}
              setFilterWithOrder={setWithResult}
              setFilterSequence={setNewFirst}
              getApiCall={getDataOrderHistory}
              inputContent={inputContent}
            />
          }

        </div>
        {!selectedOrder && !error &&
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
              dataOrders.map(study =>
                <CardStudy
                  key={`order_history_${study.id}}`}
                  study={study}
                  isSelectecStudy={selectedOrder?.id === study?.id}
                  setSelectedStudy={setSelectedOrder}
                  darkMode={true}
                />
              )}

            {!loading && dataOrders.length === 0 &&
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
              onClick={() => getDataOrderHistory({
                newFirst: true,
                currentDoctorOnly: false,
                withResult: undefined,
                inputContent: inputContent
              })}
            >
              Inténtar de nuevo
            </button>
          </div>
        </div>}


        {selectedOrder && !error &&
          <div className='flex flex-col flex-no-wrap w-full flex-1'>
            <div className="flex flex-row flex-no-wrap items-start">
              <button className='flex flex-row text-white focus:outline-none justify-center items-center gap-1' onClick={() => setSelectedOrder(null)}>
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
              {dataOrders.length > 0 && <CardDetailStudy key={'card_detail_order'} selectedStudy={selectedOrder} darkMode={true} isCall={true} />}
            </div>
          </div>
        }
      </div>
    </div>
  )
}