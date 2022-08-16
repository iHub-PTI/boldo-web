import React from 'react'
import { ReactComponent as IconCross } from '../../assets/icon-cross.svg'

const SelectItem = ({ id, value, handleDelete }) => {
  
  return (
    <div className='flex items-center m-1 px-2 py-1 w-auto h-10 bg-secondary-100 rounded-l-3xl rounded-r-3xl' key={id} id={id}>
      {value}
      <button className='m-1 focus:outline-none' onClick={()=>handleDelete(id)}>
        <IconCross></IconCross>
      </button>
    </div>
  )
}

export default SelectItem
