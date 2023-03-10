import { Transition } from '@headlessui/react'
import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'
import PencilEditIcon from '../icons/PencilEditIcon'
import { Gynecology } from "./Types";

const titlesTypesGynecology = [
  { title: 'Gestas', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'gestations_number' },
  { title: 'Partos', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'births_number' },
  { title: 'Cesáreas', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'cesarean_number' },
  { title: 'Abortos', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'abortions_number' },
  { title: 'Menarquía (en años)', beforeTitle: 'Edad de', type: 'number', tag: 'años', typeCode: 'menarche_age' },
  { title: 'Ultima menstruación', beforeTitle: '', type: 'number', typeCode: 'last_menstruation' }
]

type AddCloseProps = {
  show: boolean,
  setshow: (value: boolean) => void,
  typeCode: string,
  //dispatch: Dispatch<any>,
  gynecology: Gynecology
}

const AddClose = ({ show, setShow, typeCode, gynecology, ...props }) => {

  const handClickClose = () => {
    setShow(false)
  }

  const handleClickAdd = () => {
    //to add something it must be greater than 0
    if (Object.values(gynecology).every((value: number) => value === 0)) {
      setShow(false)
      return
    }
    //dispatch({ type: typeCode, value: gynecology })
    setShow(false)
  }

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-row flex-no-wrap gap-3 items-center absolute' {...props}
        style={{ left: '-2rem' }}
      >
        <button className='focus:outline-none' onClick={() => handClickClose()}>
          <CloseCrossIcon />
        </button>
        <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          <CheckIcon active={true} />
        </button>
      </div>
    </Transition>
  )
}

const RowTable = ({ beforeTitle, title, isDisabled, placeholder = 'Sin datos', tag = '', typeCode, gynecology, setGynecology }) => {


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGynecology({ ...gynecology, [event.target.name]: parseInt(event.target.value) })
  }

  return (
    <div className='flex flex-row flex-no-wrap rounded-md h-9 p-1 items-center w-full pl-2'
      style={{ background: 'rgba(247, 244, 244, 0.6)' }}>
      <div className='flex flex-row flex-no-wrap font-normal text-sm leading-4 text-color-disabled gap-1 w-6/12 h-8 items-center'>
        {beforeTitle} <span className='text-cool-gray-700 text-sm font-normal'>{title}</span>
      </div>
      <div className='flex flex-row flex-no-wrap w-6/12 h-7 bg-white rounded-md'>
        <input className='text-center text-sm focus:outline-none bg-transparent disabled:bg-transparent w-full rounded-md'
          type="number"
          min="0"
          step="1"
          name={typeCode}
          value={gynecology[typeCode]}
          placeholder={placeholder}
          disabled={isDisabled}
          onFocus={(event) => event.target.placeholder = ''}
          onBlur={(event) => event.target.placeholder = placeholder}
          onChange={(event) => { handleChange(event) }}
        />
      </div>
    </div>
  )
}

type Props = {
  gynecology: Gynecology,
  typeCode: string,
  //dispacth: Dispatch<any>
}

const TableGynecology = ({ gynecology, typeCode }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [hover, setHover] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  const [gynecologyState, setGynecology] = useState<Gynecology>(gynecology)

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
          <AddClose
            show={showEdit}
            setShow={setShowEdit}
            typeCode={typeCode}
            //dispatch={dispatch}
            gynecology={gynecologyState}
          />
        </div>
      </div>
      <div className='flex flex-col flex-no-wrap w-full pt-3 gap-1'>
        {titlesTypesGynecology.map((row, index) =>
          <RowTable
            key={"row" + index}
            beforeTitle={row.beforeTitle}
            title={row.title}
            isDisabled={!showEdit}
            typeCode={row.typeCode}
            gynecology={gynecologyState}
            setGynecology={setGynecology}
          />
        )}
      </div>
    </div>
  )
}

export default TableGynecology