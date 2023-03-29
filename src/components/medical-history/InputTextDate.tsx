import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("es", es)




type Props = {
  show: boolean,
  setShow?: (value?: boolean) => void,
  placeholder?: string,
  addInput: (value: { description: string, date: Date }) => void,
}

const InputTextDate: React.FC<Props> = ({
  show = false,
  setShow,
  placeholder = 'Agregar',
  addInput,
  ...props
}) => {

  const [text, setText] = useState("")
  const [valueDate, setValueDate] = useState()

  const handleClickAdd = () => {
    if (text.split(' ').every((value) => value === '')) return
    addInput({ description: text, date: valueDate })
    setText("")
    setValueDate(undefined)
  }

  const handleClickClose = () => {
    setShow(false)
  }

  const handleChangeDate = (newValue) => {
    setValueDate(newValue)
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
      <div className='flex flex-row flex-no-wrap justify-between items-center w-full bg-white h-11 py-2 px-3 rounded-lg shadow my-1'
        {...props}
      >
        <div className='flex flex-row flex-no-wrap'>
          <input className="flex flex-no-wrap w-full pl-1 pr-2 focus:outline-none h-6 font-medium text-base  items-center input-add-placeholder"
            value={text}
            onChange={(event) => { setText(event.target.value) }}
            type="text"
            style={{ letterSpacing: '0.15px', lineHeight: '24px' }}
            placeholder={placeholder} autoComplete="off"
            onKeyPress={(event) => handleKeyPress(event)}
            onKeyDown={(event) => handleKeyDown(event)}
            autoFocus={true}
          />
          <div className='flex flex-col mr-2'>
            <span className='border border-r h-full' style={{ borderRightColor: '#ABAFB6' }}></span>
          </div>
          <div className='w-5/12'>
            <DatePicker
              className="focus:outline-none font-sans pr-1 z-50 w-28"
              dateFormat="dd-MM-yyyy"
              locale="es"
              selected={valueDate}
              onChange={(date) => handleChangeDate(date)}
              showYearDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              maxDate={new Date()}
            />
          </div>
        </div>
        <div className='flex flex-row flex-no-wrap gap-1 items-center'>
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