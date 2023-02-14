import React from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import { WarningIcon } from '../icons/WarningIcon'
import ItemList from './ItemList'

type Props = {
  title: string,
  backgroundColor?: string,
}

const CardList: React.FC<Props> = ({ title, backgroundColor = "#FFF3F0", ...props }) => {
  return (
    <div className='flex flex-col w-full rounded-lg pb-4' style={{ backgroundColor: backgroundColor }}>
      <div className='flex flex-row justify-start gap-2 p-2 font-medium items-center group' style={{ color: '#DB7D68' }}>
        <WarningIcon />
        {title}
        <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-opacity delay-200 ease-in-out' />
      </div>
      <div className='flex flex-col w-full pr-5 pl-15'>
        <ItemList name="Arritmia" />
      </div>
    </div>
  )
}

export default CardList