import React from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'

const InputAddClose = ({ placeholder = 'Agregar' }) => {
  return (
    <div className='flex flex-row flex-no-wrap justify-between items-center w-full bg-white h-11 py-2 px-4 rounded-lg shadow'>
      <input className="flex flex-no-wrap w-full px-2 focus:outline-none h-6 font-medium text-base  items-center input-add-placeholder"
        type="text"
        style={{letterSpacing: '0.15px', lineHeight:'24px'}}
        placeholder={placeholder} autoComplete="off"
      />
      <div className='flex flex-row flex-no-wrap gap-3 items-center'>
        <button className='focus:outline-none'>
          <CheckIcon active={true} />
        </button>
        <button className='focus:outline-none'>
          <CloseCrossIcon />
        </button>
      </div>
    </div>
  )
}

export default InputAddClose