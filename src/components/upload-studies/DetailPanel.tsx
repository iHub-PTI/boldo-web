import React, { useEffect, useState } from 'react';
import axios from 'axios';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import { ReactComponent as SpinnerLoading } from "../../assets/spinner-loading.svg";
import Category from './Category';
import Urgency from './Urgency';
import DoctorProfile from './DoctorProfile';
import DateSection from './DateSection';


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
        // console.log(res.data)
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
                  <DoctorProfile doctor={orderStudy?.doctor} />
                  {/* date section */}
                  <DateSection authoredDate={orderStudy?.authoredDate} />
                </div>
                {/* study order details */}
                <div className='flex flex-col'>
                  <p className='not-italic font-normal text-base leading-4 text-teal-400'>Estudios Solicitados</p>
                  <div className='flex flex-col py-3'>
                    {/* category and urgency */}
                    <div className='flex flex-row space-x-4'>
                      <Category category={orderStudy?.category ?? 'Other'}/>
                      {orderStudy?.urgent && <Urgency />}
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