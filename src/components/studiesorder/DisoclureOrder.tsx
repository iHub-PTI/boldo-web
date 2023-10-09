import { Disclosure } from '@headlessui/react'
import React from 'react'
import { getCategorySvg } from '../history-study-order/StudyHistory'
import { getCategoryLabel } from '../history-study-order/CardDetailStudy'
import DetailPanel from '../upload-studies/DetailPanel'
import Urgency from '../upload-studies/Urgency'

const DisoclureOrder = () => {
  return (
    <div className='flex flex-col overflow-x-hidden'>
      <Disclosure>
        <div className='flex flex-row px-6 py-2 gap-4 flex-shrink-0'>
          <div className='text-sm text whitespace-no-wrap'>Orden Nro OM28373</div>
          <div className='w-7 flex flex-row items-center'>{getCategorySvg('laboratorio', 24, 24)}</div>
          <div className='w-20 gap-2 text-sm'>{getCategoryLabel('laboratory')}</div>
          <div className='w-20 text-sm'>15/01/2023</div>
          <div className='flex flex-row items-start pt-2'>
            <Urgency />
          </div>
          <div className='sm:hidden md:w-48 lg:w-56 lg:block xl:w-64 2xl:w-96 truncate text-sm'>
            Hemograma completo, Plaquetas, Glucosa, Orina simple
          </div>
          <Disclosure.Button className='focus:outline-none underline whitespace-no-wrap' style={{ color: '#24AAAD' }}>
            Ver más
          </Disclosure.Button>
        </div>
        <Disclosure.Panel>
          <DetailPanel orderId='37016' />
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default DisoclureOrder
