import React, { useEffect, useRef, useState } from 'react'
import InputTextField from './InputTextField'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import DateRange from '../icons/upload-icons/DateRange';
import moment from 'moment';
import { Transition } from '@headlessui/react';
registerLocale("es", es)

type Props = {
  saveRef: React.MutableRefObject<HTMLButtonElement>;
}

const StudyForm = (props:Props) => {
  const { saveRef } = props
  const [inputName, setInputName] = useState<string>('')
  const [inputNotes, setInputNotes] = useState<string>('')
  const [inputDate, setInputDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (dateSelected) => {
    setIsOpen(!isOpen)
    setInputDate(dateSelected)
  }

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const button = saveRef.current

    const handleButtonClick = () => {

    }

    if (button) {
      button.addEventListener('click', handleButtonClick)
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleButtonClick)
      }
    }
  }, [saveRef])

  return (
    <div className='flex flex-col space-y-8 p-5'>
      {/* name of the study */}
      <div className='flex flex-col space-y-1'>
        <p className='not-italic font-medium text-base leading-6 text-gray-700'>Nombre del estudio</p>
        <InputTextField id='studyName' inputText={inputName} setInputText={setInputName} />
      </div>
      {/* space for diagnosis */}

      {/* date and category */}
      <div className='flex flex-row space-x-32'>
        {/* date */}
        <div className='flex flex-col space-y-3'>
          <p className='not-italic font-medium text-base leading-6 text-gray-700'>Fecha del estudio</p>
          <button
            className='focus:outline-none'
            onClick={handleClick}
          >
            <div className='flex flex-row space-x-2'>
              {moment(inputDate ?? new Date()).format('DD-MM-YYYY') }
              <DateRange />
            </div>
          </button>
          <div>
            <Transition
              show={isOpen}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
              className='absolute'
            >
              <DatePicker
                className="focus:outline-none not-italic font-medium text-sm leading-6 text-gray-500 z-50 w-28"
                dateFormat="dd-MM-yyyy"
                locale="es"
                selected={inputDate}
                onChange={(date) => handleDateChange(date)}
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                maxDate={new Date()}
                inline
              />
            </Transition>
          </div>
        </div>
        {/* category */}
        <div></div>
      </div>
      {/* notes */}
      <div className='flex flex-col space-y-1'>
        <p className='not-italic font-medium text-base leading-6 text-gray-700'>Notas (opcional)</p>
        <InputTextField id='notes' inputText={inputNotes} setInputText={setInputNotes} />
      </div>
      {/* attachments */}
      <div></div>
    </div>
  )
}

export default StudyForm