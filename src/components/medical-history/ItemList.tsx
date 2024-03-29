import moment from 'moment'
import React, { useState } from 'react'
import TrashIcon from '../icons/TrashIcon'
import Modal from '../Modal'

type Props = {
  description: string,
  date?: Date,
  relationship?: string,
  deleteItem: () => void,
  darkMode?: boolean
  isEditable?: boolean
}

const ItemList: React.FC<Props> = ({ description, date, relationship, deleteItem, darkMode = false, isEditable = false }) => {

  const [hover, setHover] = useState(false)
  const bgColor = hover ? 'rgba(247, 244, 244, 0.6)' : ''
  const descriptionClass = darkMode ? 'font-medium text-white group-hover:text-dark-cool' :
    'font-medium text-cool-gray-700'
  const subTitle = darkMode ? 'font-normal text-sm text-white group-hover:text-dark-cool' : 'font-normal text-sm text-color-disabled'

  //delete modal handler
  const [show, setShow] = useState(false)

  const handleDeleteItem = () => {
    setShow(true)
    //deleteItem()
  }


  return (
    <>
      <div className='flex flex-row flex-no-wrap w-full justify-between px-2 h-10 items-center mt-1 group'
        onMouseOver={() => { setHover(true) }}
        onMouseLeave={() => { setHover(false) }}
        style={{
          background: bgColor,
          mixBlendMode: darkMode ? 'initial' : 'multiply',
          borderRadius: '4px'
        }}
      >
        <span className={descriptionClass}>{description}</span>
        <span className='flex flex-row flex-no-wrap gap-2 '>
          <span className={subTitle}>
            {date && moment(date).format('DD/MM/YYYY')}
            {relationship}
          </span>
          {hover && isEditable &&
            <button className='focus:outline-none' onClick={() => handleDeleteItem()}>
              <TrashIcon />
            </button>
          }
        </span>
      </div>
      <ConfirmationTemplateItemList
        show={show}
        setShow={setShow}
        description={description}
        date={date}
        relationship={relationship}
        callback={() => deleteItem()}
      />
    </>
  )
}

type PropsModal = {
  show: boolean,
  setShow: (value: boolean) => void,
  description: string,
  date: Date
  relationship: string
  callback: () => void
}


const ConfirmationTemplateItemList: React.FC<PropsModal> = (props) => {
  const { show, setShow, description, date, relationship, callback } = props
  return (
    <Modal show={show} setShow={setShow} size={'sm'} handleOutClick={false}>
      <div id="delete_confirmation_modal">
        <div className='flex flex-col flex-no-wrap'>
          <div className='mb-3'>¿Está seguro que quiere eliminar el elemento
            <span className='font-medium'>
              {` ${description}${date ? ", fecha: " + moment(date).format("DD/MM/YYYY") : ''}${relationship ? ", " + relationship : ''}`}
            </span>?
          </div>
          <div className='flex flex-row justify-between mt-5 gap-2'>
            <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
              <button
                type='button'
                className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none sm:text-sm sm:leading-5'
                onClick={() => setShow(false)}
              >
                atrás
              </button>
            </span>
            <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
              <button
                type='button'
                onClick={() => {
                  callback()
                  setShow(false)
                }}
                className='inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none'
              >
                Sí, eliminar
              </button>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ItemList