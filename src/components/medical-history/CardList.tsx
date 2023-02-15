import React, { useState } from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import CheckIcon from '../icons/CheckIcon'
import CloseButton from '../icons/CloseButton'
import CloseCrossIcon from '../icons/CloseCrossIcon'
import InputAddClose from './InputAddClose'
import ItemList from './ItemList'

type Props = {
  title: string,
  dataList: { name: string, date?: Date }[]
}

const CardList = ({ title = '', dataList = [] }) => {

  const [hover, setHover] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  const Empty = () => {
    if (dataList && dataList.length > 0) return null
    return <span className='text-base leading-6 text-color-disabled italic pl-2'
      style={{ letterSpacing: '0.15px' }}
    >
      Ninguno
    </span>
  }

  return (
    <div className='flex flex-col w-full rounded-lg pb-4 px-2 pt-2'
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: background
      }}
    >
      <div className='flex flex-row flex-no-wrap font-normal text-gray-500 text-sm pb-1 group gap-2 items-center'>
        {title}
        <button className='focus:outline-none'>
          <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-opacity delay-200 ease-in-out' />
        </button>
      </div>
      <div className='flex flex-col w-full pr-5 pl-2'>
        <InputAddClose />
        {dataList.map((data, i) => <ItemList key={'card_list_' + i} name={data.name} date={data.date} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList