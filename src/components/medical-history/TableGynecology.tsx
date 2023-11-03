import { Transition } from '@headlessui/react'
import _ from 'lodash'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useAxiosPost } from '../../hooks/useAxios'
import CloseCrossIcon from '../icons/CloseCrossIcon'
import PencilEditIcon from '../icons/PencilEditIcon'
import { GynecologyType } from "./Types"

const titlesTypesGynecology = [
  { title: 'Gestas', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'CBG' },
  { title: 'Partos', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'CBH' },
  { title: 'Cesáreas', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'CSN' },
  { title: 'Abortos', beforeTitle: 'Cantidad de', type: 'number', typeCode: 'MCE' },
  { title: 'Menarquía (en años)', beforeTitle: 'Edad de', type: 'number', tag: 'años', typeCode: 'MRE' },
  { title: 'Ultima menstruación', beforeTitle: 'Edad de', type: 'number', typeCode: 'LMT' }
]

type AddCloseProps = {
  show: boolean,
  setShow: (value: boolean) => void,
  gynecologies: GynecologyType[]
}

const AddClose: React.FC<AddCloseProps> = ({ show, setShow, gynecologies, ...props }) => {


  const handClickClose = () => {
    setShow(false)
  }

  // const handleClickAdd = () => {
  //   //to add something it must be greater than 0
  //   if (Object.values(gynecologies).every((g) => g.value === 0)) {
  //     setShow(false)
  //     return
  //   }

  //   setShow(false)
  // }

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
      //style={{ left: '-2rem' }}
      >
        <button className='focus:outline-none' onClick={() => handClickClose()}>
          <CloseCrossIcon />
        </button>
        {/* <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          <CheckIcon active={true} />
        </button> */}
      </div>
    </Transition>
  )
}

const RowTable = ({
  beforeTitle,
  title,
  isDisabled,
  placeholder = 'Sin datos',
  //tag = '',
  typeCode,
  gynecologies,
  setGynecology,
  url,
  patientId,
  organizationId,
  appointmentId,
  handlerSaveLoading
}) => {

  const { loading: loadPost, error: errorPost, sendData } = useAxiosPost(url)

  useEffect(() => {
    if (errorPost) return
    if (loadPost !== null) handlerSaveLoading(loadPost)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPost])


  const debounceSendData = useCallback(
    _.debounce((
      patientId,
      organizationId,
      appointmentId,
      code,
      value
    ) => {
      sendData({
        patientId,
        organizationId,
        appointmentId,
        code,
        value
      })
    }, 1000)
    , [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debounceSendData(
      patientId,
      organizationId,
      appointmentId,
      event.target.name,
      event.target.value,
    )
  }

  return (
    <div className='flex flex-row flex-no-wrap rounded-md h-9 p-1 items-center w-full pl-2'
      style={{ background: 'rgba(247, 244, 244, 0.6)' }}>
      <div className='flex flex-row flex-no-wrap font-normal text-sm leading-4 text-color-disabled gap-1 w-6/12 h-8 items-center'>
        {beforeTitle} <span className='text-cool-gray-700 text-sm font-normal'>{title}</span>
      </div>
      <div className='flex flex-row flex-no-wrap w-6/12 h-7 bg-white rounded-md'>
        <input className='text-center text-sm focus:outline-none bg-transparent disabled:bg-transparent w-full rounded-md'
          id={gynecologies.find(x => x.code === typeCode)?.id}
          type="number"
          min="0"
          step="1"
          name={typeCode}
          defaultValue={gynecologies.find(x => x.code === typeCode)?.value}
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
  gynecologies: GynecologyType[],
  url?: string
  patientId: string,
  organizationId: string,
  appointmentId: string
  darkMode?: boolean
  isEditable?: boolean
  handlerSaveLoading?: (value: boolean | null) => void
}

const TableGynecology: React.FC<Props> = ({ gynecologies, url, patientId, organizationId, appointmentId, handlerSaveLoading, darkMode = false, isEditable = false }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [hover, setHover] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  const [gynecologyState, setGynecology] = useState<GynecologyType[]>(gynecologies)

  // useEffect(() => {
  //   console.log(gynecologyState)
  // }, [gynecologyState])

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
          className={`font-medium text-base leading-6 ${darkMode ? 'text-orange-dark' : 'text-primary-500'}`}
          style={{ letterSpacing: '0.15px' }}>
          Ginecología
        </div>
        <div className='flex flex-row flex-no-wrap relative w-6'>
          <button className='focus:outline-none absolute left-0' onClick={() => { handleClickEdit() }}>
            {hover && !showEdit && isEditable && <PencilEditIcon fill={darkMode ? '#DB7D68' : '#27BEC2'} />}
          </button>
          <AddClose
            show={showEdit}
            setShow={setShowEdit}
            gynecologies={gynecologyState}
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
            gynecologies={gynecologyState}
            setGynecology={setGynecology}
            url={url}
            patientId={patientId}
            organizationId={organizationId}
            appointmentId={appointmentId}
            handlerSaveLoading={handlerSaveLoading}
          />
        )}
      </div>
    </div>
  )
}

export default TableGynecology