import React from 'react'
import { ReactComponent as IconCross } from '../assets/icon-cross.svg'

const SelectItem = props => {
  const { item } = props
  return (
    <div className='flex items-center m-1 px-2 py-1 w-auto h-10 bg-secondary-100 rounded-l-3xl rounded-r-3xl'>
      {item}
      <button className='m-1 focus:outline-none'>
        <IconCross></IconCross>
      </button>
    </div>
  )
}

export default SelectItem
