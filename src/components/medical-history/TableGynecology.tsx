import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'
import PencilEditIcon from '../icons/PencilEditIcon'


const AddClose = ({ show, setShow, ...props }) => {

  const handClickClose = () => {
    setShow(false)
  }

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-row flex-no-wrap gap-3 items-center absolute' {...props}
        style={{ left: '-2rem' }}
      >
        <button className='focus:outline-none' onClick={() => handClickClose()}>
          <CloseCrossIcon />
        </button>
        <button className='focus:outline-none'>
          <CheckIcon active={true} />
        </button>
      </div>
    </Transition>
  )
}


const TableGynecology = () => {

  const [showEdit, setShowEdit] = useState(false)
  const [hover, setHover] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  const handleClickEdit = () => {
    setShowEdit(!showEdit)
  }
  return (
    <div
      className='flex flex-col flex-no-wrap rounded-lg p-2'
      style={{ background: background }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='flex flex-row flex-no-wrap justify-between items center'>
        <div
          className='font-medium text-primary-500 text-base leading-6'
          style={{ letterSpacing: '0.15px' }}>
          Ginecología
        </div>
        <div className='flex flex-row flex-no-wrap relative w-6'>
          <button className='focus:outline-none absolute left-0' onClick={() => { handleClickEdit() }}>
            {hover && !showEdit && <PencilEditIcon />}
          </button>
          <AddClose show={showEdit} setShow={setShowEdit} />
        </div>
      </div>
      <div className='flex flex-col flex-no-wrap w-full pt-3'>
        <div className='flex flex-row flex-no-wrap rounded-sm h-8 p-1 items-center w-full'>
          <div className='flex flex-row flex-no-wrap font-normal text-sm leading-4 text-color-disabled gap-1 w-6/12 h-8 items-center'>
            Cantidad de <span className='text-cool-gray-700 text-sm font-normal'>Gestas</span>
          </div>
          <div className='flex flex-row flex-no-wrap w-6/12 h-8 bg-white'>
            <input className='text-center text-sm focus:outline-none disabled:bg-transparent w-full' type="text" placeholder='Sin Datos'
              disabled={!showEdit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableGynecology