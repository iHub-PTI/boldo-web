import React from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import { WarningIcon } from '../icons/WarningIcon'
import ItemList from './ItemList'

type Props = {
  title: string,
  dataList: {name: string, date?: Date}[]
  backgroundColor?: string
}

const CardList: React.FC<Props> = ({ title = '', dataList = [], backgroundColor = "#FFF3F0", ...props }) => {

  const Empty = () => {
    if (dataList && dataList.length > 0) return null
    return <span className='text-base leading-6 text-color-disabled italic'
      style={{ letterSpacing: '0.15px' }}
    >
      Ninguno
    </span>
  }

  return (
    <div className='flex flex-col w-full rounded-lg pb-4' style={{ backgroundColor: backgroundColor }}>
      <div className='flex flex-row justify-start gap-2 p-2 font-medium items-center group' style={{ color: '#DB7D68' }}>
        <WarningIcon />
        {title}
        <button className='focus:outline-none'>
          <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-opacity delay-200 ease-in-out' />
        </button>
      </div>
      <div className='flex flex-col w-full pr-5 pl-15'>
        {dataList.map((data, i) => <ItemList key={'card_list_w' + i} name={data.name} date={data.date} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList