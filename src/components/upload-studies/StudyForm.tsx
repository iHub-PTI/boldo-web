import React, { useContext, useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react';
import { AttachmentFilesFormContext } from '../../contexts/AttachmentFilesForm'; 
import InputTextField from './InputTextField'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import DateRange from '../icons/upload-icons/DateRange';
import moment from 'moment';
import AttachmentIcon from '../icons/upload-icons/AttachmentsIcon';
import PlusIcon from '../icons/upload-icons/PlusIcon';
import StudyCard from './StudyCard';
registerLocale("es", es)

type Props = {
  saveRef: React.MutableRefObject<HTMLButtonElement>;
}

const StudyForm = (props:Props) => {
  const { saveRef } = props
  const { attachmentFilesForm, setAttachmentFilesForm } = useContext(AttachmentFilesFormContext)
  const [inputName, setInputName] = useState<string>('')
  const [inputNotes, setInputNotes] = useState<string>('')
  const [inputDate, setInputDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  // this reference we use to simulate the click on the custom button
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleDateChange = (dateSelected) => {
    setIsOpen(!isOpen)
    setInputDate(dateSelected)
  }

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      // define the array of exitsting files
      const existingFileList = Array.from(attachmentFilesForm)
      // define the array of new files
      const newFileList = Array.from(files)
      // verify that the file doesn't exist
      newFileList.forEach((newFile) => {
        if (!existingFileList.some((file) => file.name === newFile.name)) {
          existingFileList.push(newFile)
        }
      })
      // create an auxiliar list
      const updatedList = new DataTransfer()
      // to add the new files
      existingFileList.forEach((file) => updatedList.items.add(file))
      // and then we assign it again
      setAttachmentFilesForm(updatedList.files)
    }
  }

  const renderFileList = () => {
    let arrayOfFiles = Array.from(attachmentFilesForm)

    const renderedFiles = arrayOfFiles.map((file, index) => {
      return  <StudyCard 
                key={index}
                file={file}
                index={index}
              />
    })

    return renderedFiles;
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
  }, [saveRef, attachmentFilesForm])

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
      <div className='p-4 border-2 box-border rounded-lg border-gray-200'>
        <div className='flex flex-col space-y-4'>
          {/* title and button to add files */}
          <div className='flex flex-row justify-between items-center'>
            {/* logo and title */}
            <div className='flex flex-row space-x-4 items-center'>
              <AttachmentIcon />
              <p className='not-italic font-medium text-xl leading-7 text-gray-700'>Adjuntos</p>
            </div>
            {/* button to add files */}
            {/* DONT DELETE THIS INPUT */}
            <input
              type="file"
              multiple
              accept=".pdf, .jpeg, .jpg, .png"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
            <button
              className='focus:outline-none rounded-lg p-2 hover:bg-gray-100'
              onClick={handleButtonClick}
            >
              <div className='flex flex-row items-center space-x-2'>
                <p className='not-italic font-normal text-base leading-6 text-teal-400'>Añadir archivo</p>
                <PlusIcon />
              </div>
            </button>
          </div>
          {/* list of existing files */}
          { attachmentFilesForm.length > 0 &&
            <div className='flex flex-col space-y-2 p-2'>
              {
                renderFileList()
              }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default StudyForm