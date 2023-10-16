import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ReactComponent as SpinnerLoading } from '../../assets/spinner-loading.svg'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { getCategoryLabel } from '../history-study-order/CardDetailStudy'
import { getCategorySvg } from '../history-study-order/OrderHistory'
import DateSection from '../upload-studies/DateSection'
import DoctorProfile from '../upload-studies/DoctorProfile'

type Props = {
  orderID?: string
}

const getStudies = (studies = []) => {
  return studies.map((x, idx) => (
    <li key={idx} className='text-cool-gray-700 text-sm'>
      {x.display}
    </li>
  ))
}

const OrderDetailStudy: React.FC<Props> = ({ orderID }) => {
  const [studyOrder, setStudyOrder] = useState<Boldo.OrderStudy>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    let url = `/profile/doctor/serviceRequest/${orderID ?? ''}`

    axios
      .get(url)
      .then(res => {
        // console.log(res.data)
        setStudyOrder(res.data)
      })
      .catch(err => {
        const tags = {
          endpoint: url,
          method: 'GET',
        }
        handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET_DESCRIPTION, tags)
        setError(true)
      })
      .finally(() => setLoading(false))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-full h-full px-5 py-3'>
      {loading ? (
        <div className='flex justify-center items-center'>
          <SpinnerLoading />
        </div>
      ) : error ? (
        <p>Ocurrió un error al cargar los datos</p>
      ) : (
        studyOrder && (
          <div className='flex flex-col space-y-6'>
            {/* profile and date */}
            <div className='flex flex-col gap-2'>
              {/* profile */}
              <DoctorProfile doctor={studyOrder?.doctor} organization={studyOrder?.organization} />
              {/* date section */}
              <DateSection authoredDate={studyOrder?.authoredDate} />
            </div>

            {/* Diagnosis */}
            {studyOrder?.diagnosis && (
              <div className={`flex flex-col gap-1`}>
                <div className='text-primary-500'>Impresión diagnóstica</div>
                <div className='font-semibold' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
                  {studyOrder?.diagnosis}
                </div>
              </div>
            )}
            <div className='flex flex-col gap-2 mt-3'>
              <div className={'text-primary-500'}>Estudios solicitados</div>
              <div className={`flex flex-col p-3 `} style={{ border: '3px solid #F6F4F4', borderRadius: '16px' }}>
                {/* Header Study */}
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row gap-2 items-center'>
                    {getCategorySvg(studyOrder?.category, 24, 24)}
                    <div className='text-cool-gray-700 text-sm' style={{ lineHeight: '20px' }}>
                      {getCategoryLabel(studyOrder?.category)}
                    </div>
                  </div>
                  {studyOrder?.urgent && (
                    <div
                      className='flex flex-row justify-center'
                      style={{
                        padding: '1px 6px',
                        width: '54px',
                        height: '18px',
                        background: '#E8431F',
                        borderRadius: '4px',
                      }}
                    >
                      <span
                        className='font-semibold text-white'
                        style={{
                          fontSize: '10px',
                          lineHeight: '16px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        urgente
                      </span>
                    </div>
                  )}
                </div>
                {/* Body Study */}
                <div className='flex flex-row pt-1'>
                  <ul className='list-disc list-inside ml-2 pt-2'>{getStudies(studyOrder?.studiesCodes)}</ul>
                </div>
                {/* Observation */}
                {studyOrder?.notes && (
                  <div className='flex flex-col mt-2'>
                    <div className='text-sm text-cool-gray-700'>Observaciones:</div>
                    <div className='text-sm text-cool-gray-700'>{studyOrder?.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default OrderDetailStudy
