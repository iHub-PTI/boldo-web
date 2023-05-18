import React, { useEffect, useState } from 'react';
import axios from 'axios';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import { countDays } from '../../util/helpers'
import { ReactComponent as SpinnerLoading } from "../../assets/spinner-loading.svg";
import NoProfilePicture from '../icons/NoProfilePicture';
import CalendarIcon from '../icons/upload-icons/CalendarIcon';
import moment from 'moment';
import Category from './Category';
import Urgency from './Urgency';


type Props = {
  orderId: string
}


const DetailPanel = (props: Props) => {
  const {orderId=''} = props

  const [orderStudy, setOrderStudy] = useState<Boldo.OrderStudy>(undefined)
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)

  useEffect(() => {
    setLoadingOrder(true)
    let url = `/profile/doctor/serviceRequest/${orderId}`

    axios
      .get(url)
      .then((res) => {
        console.log(res.data)
        setOrderStudy(res.data as Boldo.OrderStudy)
      })
      .catch((err) => {
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET_DESCRIPTION, tags)
        setLoadError(true)
      })
      .finally(() => setLoadingOrder(false))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-full h-full px-5 py-3'>
      {
        loadingOrder
          ? <div className='flex justify-center items-center'>
            <SpinnerLoading />
          </div>
          : loadError
            ? <p>Ocurrió un error al cargar los datos</p>
            : orderStudy &&
              <div className='flex flex-col space-y-6'>
                {/* profile and date */}
                <div className='flex flex-row justify-between'>
                  {/* profile */}
                  <div className='flex flex-col space-y-2'>
                    {/* text */}
                    <p className='font-semibold text-xs not-italic leading-4 text-gray-500'>Orden</p>
                    {/* photo and description */}
                    <div className='flex flex-row space-x-4'>
                      { false
                        ? <img
                            src=''
                            alt='Foto de Perfil'
                            className='flex-none border-1 border-white w-11 h-11 rounded-full object-cover'
                          />
                        : <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-11 h-11' />
                      }
                      {/* name and description */}
                      <div className='flex flex-col'>
                        {/* prefix and name */}
                        <p className='font-normal text-base not-italic leading-6 text-gray-700'>Dr. Mario Cabañas</p>
                        {/* description */}
                        <div className='flex flex-row items-center space-x-1'>
                          {/* specialty */}
                          <p className='font-normal text-xs not-italic leading-4 text-gray-600'>Cardiólogo</p>
                          {/* circle */}
                          <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                          {/* Hospital */}
                          <p className='font-normal text-xs not-italic leading-4 text-gray-600'>Hospital Los Ángeles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* date section */}
                  <div className='flex flex-col space-y-4'>
                    <p className='font-semibold text-xs not-italic leading-4 text-gray-500'>Solicitado en fecha</p>
                    <div className='flex flex-row items-center space-x-3'>
                      {/* icon and date */}
                      <div className='flex flex-row items-center space-x-2'>
                        <CalendarIcon />
                        <p className='font-normal text-sm not-italic leading-4'>{(moment(orderStudy?.authoredDate ?? new Date())).format('DD/MM/YYYY')}</p>
                      </div>
                      {/* count days ago */}
                      <p className='font-normal text-sm not-italic leading-4 text-gray-500'>{countDays(orderStudy.authoredDate) ?? 'No fue posible calcular'}</p>
                    </div>
                  </div>
                </div>
                {/* study order details */}
                <div className='flex flex-col'>
                  <p className='not-italic font-normal text-base leading-4 text-teal-400'>Estudios Solicitados</p>
                  <div className='flex flex-col py-3'>
                    {/* category and urgency */}
                    <div className='flex flex-row space-x-4'>
                      <Category category={orderStudy.category}/>
                      {orderStudy.urgent && <Urgency />}
                    </div>
                    {/* study codes */}
                    { orderStudy?.studiesCodes &&
                      <p className='mt-3 mb-7 not-italic font-normal text-sm leading-4 text-gray-700'>
                        {orderStudy.studiesCodes.map((code) => code?.display ?? '').join(', ')}
                      </p>
                    }
                    { orderStudy?.notes &&
                      <div className='flex flex-col space-y-2'>
                        <p className='not-italic font-normal text-sm leading-5 text-gray-700'>Observaciones:</p>
                        <p className='not-italic font-normal text-sm leading-5 text-gray-700'>{orderStudy.notes}</p>
                      </div>
                    }
                  </div>
                </div>
              </div>
      }
    </div>
  );
}


export default DetailPanel;