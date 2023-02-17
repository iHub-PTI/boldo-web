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

const RowTable = ({ beforeTitle, title, isDisabled, placeholder = 'Sin datos' }) => {
  return (
    <div className='flex flex-row flex-no-wrap rounded-md h-9 p-1 items-center w-full'
      style={{ background: 'rgba(247, 244, 244, 0.6)' }}>
      <div className='flex flex-row flex-no-wrap font-normal text-sm leading-4 text-color-disabled gap-1 w-6/12 h-8 items-center'>
        {beforeTitle} <span className='text-cool-gray-700 text-sm font-normal'>{title}</span>
      </div>
      <div className='flex flex-row flex-no-wrap w-6/12 h-7 bg-white rounded-md'>
        <input className='text-center text-sm focus:outline-none bg-transparent disabled:bg-transparent w-full rounded-md' type="text" placeholder={placeholder}
          disabled={isDisabled}
          onFocus={(event) => event.target.placeholder = ''}
          onBlur={(event) => event.target.placeholder = placeholder}
        />
      </div>
    </div>
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
      <div className='flex flex-col flex-no-wrap w-full pt-3 gap-1'>
        <RowTable
          beforeTitle={'Cantidad de'}
          title='Gestas'
          isDisabled={!showEdit}
        />
        <RowTable
          beforeTitle={'Cantidad de'}
          title='Partos'
          isDisabled={!showEdit}
        />
        <RowTable
          beforeTitle={'Cantidad de'}
          title='Cesáreas'
          isDisabled={!showEdit}
        />
        <RowTable
          beforeTitle={'Cantidad de'}
          title='Abortos'
          isDisabled={!showEdit}
        />
        <RowTable
          beforeTitle={'Edad de'}
          title='Menarquía'
          isDisabled={!showEdit}
        />
        <RowTable
          beforeTitle={''}
          title='Ultima menstruación'
          isDisabled={!showEdit}
        />
      </div>
    </div>
  )
}

export default TableGynecology