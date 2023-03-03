import moment from 'moment'
import React, { useState } from 'react'
import { callbackify } from 'util'
import TrashIcon from '../icons/TrashIcon'
import Modal from '../Modal'

type Props = {
  name: string,
  date?: Date,
  description?: string,
  deleteItem: () => void,
}

const ItemList: React.FC<Props> = ({ name, date, description, deleteItem }) => {

  const [hover, setHover] = useState(false)
  const bgColor = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  //delete modal handler
  const [show, setShow] = useState(false)

  const handleDeleteItem = () => {
    setShow(true)
    //deleteItem()
  }


  return (
    <>
      <div className='flex flex-row flex-no-wrap w-full justify-between px-2 h-10 items-center mt-1'
        onMouseOver={() => { setHover(true) }}
        onMouseLeave={() => { setHover(false) }}
        style={{
          background: bgColor,
          mixBlendMode: 'multiply',
          borderRadius: '4px'
        }}
      >
        <span className='font-medium text-cool-gray-700'>{name}</span>
        <span className='flex flex-row flex-no-wrap gap-2 '>
          <span className='font-normal text-sm text-color-disabled'>
            {date && moment(date).format('DD/MM/YYYY')}
            {description}
          </span>
          {hover &&
            <button className='focus:outline-none' onClick={() => handleDeleteItem()}>
              <TrashIcon />
            </button>
          }
        </span>
      </div>
      <ConfirmationTemplateItemList
        show={show}
        setShow={setShow}
        name={name}
        date={date}
        description={description} 
        callback={() => deleteItem()}
        />
    </>
  )
}

type PropsModal = {
  show: boolean,
  setShow: (value: boolean) => void,
  name: string,
  date: Date
  description: string
  callback: () => void
}
const ConfirmationTemplateItemList: React.FC<PropsModal> = (props) => {
  const { show, setShow, name, date, description, callback } = props
  return (
    <Modal show={show} setShow={setShow} size={'sm'} handleOutClick={false}>
      <div className='flex flex-col flex-no-wrap'>
        <div className='mb-3'>¿Está seguro que quiere eliminar el elemento
          <span className='font-medium'>
            {` ${name}${date ? " " + moment(date).format("DD/MM/YYYY") : ''}${description ? " " + description : ''}`}
          </span>?
        </div>
        <div className='flex justify-end mt-5 gap-2'>
          <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
            <button
              type='button'
              onClick={() => {
                callback()
                setShow(false)
              }}
              className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none'
            >
              Confirmar
            </button>
          </span>
          <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
            <button
              type='button'
              className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none sm:text-sm sm:leading-5'
              onClick={() => setShow(false)}
            >
              Volver
            </button>
          </span>
        </div>
      </div>
    </Modal>
  )
}

export default ItemList