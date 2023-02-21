import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'

type Props = {
  show: boolean,
  setShow?: (value?: boolean) => void,
  placeholder?: string,
}

const InputTextDate: React.FC<Props> = ({
  show = false,
  setShow,
  placeholder = 'Agregar',
  ...props
}) => {

  const [text, setText] = useState("")
  const [value, setValue] = useState(null)

  const handleClickAdd = () => {

  }

  const handleClickClose = () => {

  }

  const handleChangeDate = (newValue) => {
    setValue(newValue)
  }

  const handleKeyPress = (event) => {
    if (event.target.value === '') return
    let temp = event.target.value.split(' ')
    //check that there are no spaces
    if (temp.every((value) => value === '')) return
    if (event.key === 'Enter') {
      handleClickAdd()
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShow(false)
      setText('')
    }
  }

  return (
    <Transition
      show={show}
      enter="transform transition duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transform duration-500 transition linear"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-row flex-no-wrap justify-between items-center w-full bg-white h-11 py-2 px-4 rounded-lg shadow my-1'
        {...props}
      >
        <input className="flex flex-no-wrap w-6/12 px-2 focus:outline-none h-6 font-medium text-base  items-center input-add-placeholder"
          value={text}
          onChange={(event) => { setText(event.target.value) }}
          type="text"
          style={{ letterSpacing: '0.15px', lineHeight: '24px' }}
          placeholder={placeholder} autoComplete="off"
          onKeyPress={(event) => handleKeyPress(event)}
          onKeyDown={(event) => handleKeyDown(event)}
        />
        <div className='flex flex-row flex-no-wrap gap-3 items-center'>
          <button className='focus:outline-none' onClick={() => handleClickAdd()}>
            <CheckIcon active={true} />
          </button>
          <button className='focus:outline-none' onClick={() => handleClickClose()}>
            <CloseCrossIcon />
          </button>
        </div>
      </div>
    </Transition>
  )
}

export default InputTextDate