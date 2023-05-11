import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { ReactComponent as SpinnerLoading } from "../../assets/spinner-loading.svg"
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';


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
    <div className='w-full h-full'>
      {
        loadingOrder
          ? <div className='flex justify-center items-center'>
            <SpinnerLoading />
          </div>
          : loadError
            ? <p>Ocurrió un error al cargar los datos</p>
            : orderStudy &&
              <div>
                <p>{orderStudy.category ?? 'Sin Categoria'}</p>
                <p>{orderStudy.authoredDate ?? 'Sin fecha de autorización'}</p>
                <p>{orderStudy.orderNumber ?? 'Sin número de orden'}</p>
                <p>{orderStudy.urgent ? 'Ugente' : 'No es urgente'}</p>
              </div>
      }
    </div>
  );
}


export default DetailPanel;