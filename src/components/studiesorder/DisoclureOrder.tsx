import { Disclosure } from '@headlessui/react'
import moment from 'moment'
import React from 'react'
import { getCategoryLabel } from '../history-study-order/CardDetailStudy'
import { getCategorySvg } from '../history-study-order/StudyHistory'
import DetailPanel from '../upload-studies/DetailPanel'
import Urgency from '../upload-studies/Urgency'
import { ReactComponent as EyesIcon } from '../../assets/eyes-icon.svg'

type Props = {
  order: Boldo.OrderStudy
  small?: boolean
}
const DisoclureOrder: React.FC<Props> = ({ order = null, small = false }) => {
  if (!order) return <span className='text-red-500'>Ha ocurrido un error al cargar esta órden</span>
  return (
    <div className='flex flex-col flex-1 hover:bg-neutral-gray transition-colors ease-linear duration-100 rounded-lg'>
      <Disclosure>
        <div className='flex flex-row px-2 py-2 gap-3 flex-shrink-0 justify-start'>
          <div className='text-sm text whitespace-no-wrap text-dark-cool font-medium'>
            Orden Nro: {order.orderNumber}
          </div>
          <div className='w-7 flex flex-row items-center'>{getCategorySvg(order.category, 24, 24)}</div>
          <div className='w-20 gap-2 text-sm leading-5 text-gray-900'>{getCategoryLabel(order.category)}</div>
          {!small && (
            <div className='w-20 text-sm leading-5 text-gray-900'>
              {order.authoredDate ? moment(order.authoredDate).format('DD/MM/YYYY') : 'Fecha Desconocida'}
            </div>
          )}
          {!small && <div className='flex flex-row items-start pt-1 w-15'>{order.urgent && <Urgency />}</div>}
          {!small && (
            <div className='sm:hidden md:w-48 lg:w-56 lg:block xl:w-64 2xl:w-96 truncate text-sm leading-5 text-gray-900'>
              {order.studiesCodes.map(study => study.display).join(', ')}
            </div>
          )}
          <Disclosure.Button className='focus:outline-none underline whitespace-no-wrap' style={{ color: '#24AAAD' }}>
            <EyesIcon />
          </Disclosure.Button>
        </div>
        <Disclosure.Panel>
          <DetailPanel orderId={order.id} small={small} />
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default DisoclureOrder
