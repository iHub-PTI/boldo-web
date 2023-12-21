import React, { useContext, useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import { AttachmentFilesFormContext } from '../../contexts/AttachmentFilesForm'
import { useToasts } from '../Toast'
import InputTextField from './InputTextField'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import DateRange from '../icons/upload-icons/DateRange'
import moment from 'moment'
import AttachmentIcon from '../icons/upload-icons/AttachmentsIcon'
import PlusIcon from '../icons/upload-icons/PlusIcon'
import StudyCard from './StudyCard'
import ListboxCustom, { Item } from './ListboxCustom'
import { ReactComponent as OtherIcon } from '../../assets/icon-other.svg'
import { ReactComponent as ImgIcon } from '../../assets/img-icon.svg'
import { ReactComponent as LabIcon } from '../../assets/laboratory-icon.svg'
import { Presigned } from './OrderImported'
import axios from 'axios'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
registerLocale('es', es)

type Props = {
  saveRef: React.MutableRefObject<HTMLButtonElement>
  patientId: string
  setLoadingSubmit: (loading: boolean) => void
}

const defaultValue = { value: '', name: 'Categoría' } as Item

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

const Categories = [
  { value: 'LABORATORY', name: 'Laboratorio', icon: <LabIcon /> },
  { value: 'IMAGE', name: 'Imágenes', icon: <ImgIcon /> },
  { value: 'OTHER', name: 'Otros', icon: <OtherIcon /> },
  defaultValue,
]

const StudyForm = (props: Props) => {
  const { saveRef, patientId, setLoadingSubmit } = props
  const { attachmentFilesForm, setAttachmentFilesForm } = useContext(AttachmentFilesFormContext)
  const [inputName, setInputName] = useState<string>('')
  const [inputReason, setInputReason] = useState<string>('')
  const [inputNotes, setInputNotes] = useState<string>('')
  const [inputDate, setInputDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<Item>(defaultValue)
  // this reference we use to simulate the click on the custom button
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToasts()

  // this function handle any change in date from calendar
  const handleDateChange = dateSelected => {
    setIsOpen(!isOpen)
    setInputDate(dateSelected)
  }

  // this function handle the calendar open/close
  const handleClick = e => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  // this function handle add attachment files button
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // this function handle files selected from computer
  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      // define the array of exitsting files
      const existingFileList = Array.from(attachmentFilesForm)
      // define the array of new files
      const newFileList = Array.from(files)
      // verify that the file doesn't exist
      newFileList.forEach(newFile => {
        if (!existingFileList.some(file => file.name === newFile.name)) {
          if (allowedTypes.includes(newFile?.type)) {
            existingFileList.push(newFile)
          } else {
            addToast({
              type: 'warning',
              title: '¡Atención!',
              text: '¡El tipo de archivo no es válido! Solo se permiten archivos de los tipos: jpg, jpeg, png y pdf.',
            })
            return
          }
        }
      })
      // create an auxiliar list
      const updatedList = new DataTransfer()
      // to add the new files
      existingFileList.forEach(file => updatedList.items.add(file))
      // and then we assign it again
      setAttachmentFilesForm(updatedList.files)
    }
  }

  // this function render a list of fileList object
  const renderFileList = () => {
    let arrayOfFiles = Array.from(attachmentFilesForm)

    const renderedFiles = arrayOfFiles.map((file, index) => {
      return (
        <StudyCard
          key={index}
          file={file}
          index={index}
          attachmentFiles={attachmentFilesForm}
          setAttachmentFiles={setAttachmentFilesForm}
        />
      )
    })

    return renderedFiles
  }

  const getUploadUrl = (): Promise<Presigned> => {
    let url = '/presigned'

    return new Promise(async (resolve, reject) => {
      await axios
        .get(url)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          const tags = {
            endpoint: url,
            method: 'GET',
          }
          handleSendSentry(err, ERROR_HEADERS.PRESIGNED.FAILURE_GET, tags)
          reject({} as Presigned)
        })
    })
  }

  const uploadFile = (file: File, presigned: Presigned): Promise<Boldo.AttachmentUrl | null> => {
    if (!presigned) return null
    return new Promise((resolve, reject) => {
      axios
        .put(presigned?.uploadUrl ?? '', file, {
          withCredentials: false,
          headers: { 'Content-Type': file.type, authentication: null },
        })
        .then(res => {
          if (res.status === 201) {
            resolve({
              contentType: file.type,
              // title: file.name,
              url: presigned.location,
            })
          }
        })
        .catch(err => {
          reject({} as Boldo.AttachmentUrl)
          const tags = {
            'upload-url': presigned.uploadUrl,
            method: 'PUT',
          }
          let messageError = err?.message ?? ''
          if (err?.response?.status === 413) {
            messageError = `No se ha podido subir el archivo: ${file.name} porque supera el limite permitido`
          } else {
            handleSendSentry(err, ERROR_HEADERS.FILE.FAILURE_UPLOAD, tags)
          }

          addToast({
            type: 'error',
            title: '¡Ha ocurrido un error!',
            text: `Error en la subida de estudios, por favor inténtelo de nuevo. O vuelva a intetarlo más tarde. Detalles: ${messageError
              } `,
          })
        })
        .finally(() => {
          setLoadingSubmit(false)
        })
    })
  }

  const uploadStudy = (attachmentUrls: Boldo.AttachmentUrl[]): Promise<boolean> => {
    if (!attachmentUrls) return

    let url = '/profile/doctor/diagnosticReport'

    let currentDate = inputDate
    let year = currentDate.getFullYear()
    let month = String(currentDate.getMonth() + 1).padStart(2, '0')
    let day = String(currentDate.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    return new Promise((resolve, reject) => {
      axios
        .post(url, {
          attachmentUrls: attachmentUrls,
          category: selectedValue.value ?? 'OTHER',
          reason: inputReason,
          notes: inputNotes,
          description: inputName,
          effectiveDate: formattedDate,
          patientId: patientId,
        })
        .then(res => {
          if (res.status === 201) resolve(true)
        })
        .catch(err => {
          const tags = {
            endpoint: url,
            method: 'POST',
          }
          handleSendSentry(err, ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_POST, tags)
          reject(false)
        })
    })
  }

  const handleSubmit = (): boolean => {
    let formInvalid = false

    if (inputName === '') {
      formInvalid = true
      addToast({ type: 'warning', title: 'Atención!', text: 'El nombre del estudio es un campo requerido.' })
    }
    if (inputReason === '') {
      formInvalid = true
      addToast({ type: 'warning', title: 'Atención!', text: 'El motivo del estudio es un campo requerido.' })
    }
    if (!inputDate) {
      formInvalid = true
      addToast({ type: 'warning', title: 'Atención!', text: 'Debe seleccionar la fecha de realización del estudio.' })
    }
    if (selectedValue.value === '') {
      formInvalid = true
      addToast({ type: 'warning', title: 'Atención!', text: 'Debe seleccionar la categoría del estudio.' })
    }
    if (attachmentFilesForm.length === 0) {
      formInvalid = true
      addToast({ type: 'warning', title: 'Atención', text: 'Debe adjuntar al menos un estudio.' })
    }

    return formInvalid
  }

  // this hook handle the actions when save is clicked
  useEffect(() => {
    const button = saveRef.current

    const handleButtonClick = async () => {
      if (!handleSubmit()) {

        let filesError = []

        let isSmallSize = Array.from([...attachmentFilesForm]).every(file => {
          let fileSizeInMB = file.size / (1024 * 1024)
          if(fileSizeInMB > 10){
            filesError.push(file.name)
            return false
          }else {
            return true
          }
        })

        if (isSmallSize) {
          let attachmentUrls: Boldo.AttachmentUrl[] = []
          // init the submit
          setLoadingSubmit(true)
          for (let i = 0; i < attachmentFilesForm.length; i++) {
            let presigned: Presigned = await getUploadUrl()

            const file = attachmentFilesForm[i]

            let attachmentUrl = await uploadFile(file, presigned)

            attachmentUrls.push(attachmentUrl)
          }

          let response = await uploadStudy(attachmentUrls)

          setLoadingSubmit(false)
          if (response) {
            handleReset()
            addToast({ type: 'info', title: 'Operación exitosa.', text: 'Resultado adjuntado correctamente.' })
          } else {
            addToast({
              type: 'error',
              title: 'Ocurrió un error.',
              text: 'No se han podido adjuntar los estudios. Por favor, vuelva a intentarlo más tarde.',
            })
          }
        } else {
          //validar mayor a 10mb en bytes
          let message = ''
          if(filesError.length){
            message = `No se subieron los siguientes archivos: ${filesError.join(', ')} porque superan el limite permitido de 10 mb`
          }
          addToast({
            type: 'warning',
            title: '¡No se han subido los archivos!',
            text: `Detalles: ${message}`,
          })
        }
        filesError = []
      }
    }

    if (button) {
      button.addEventListener('click', handleButtonClick)
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handleButtonClick)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveRef, fileInputRef, inputDate, inputName, inputReason, inputNotes, selectedValue, attachmentFilesForm])

  // this function handle the reset of the window when all inputs are completed
  const handleReset = () => {
    setInputName('')
    setInputReason('')
    setInputDate(null)
    // category option
    setSelectedValue(defaultValue)
    setInputNotes('')
    // reset attachmentUrls
    setAttachmentFilesForm(new DataTransfer().files)
  }

  return (
    <div className='flex flex-col space-y-8 p-5'>
      {/* name of the study */}
      <div className='flex flex-col space-y-1'>
        <p className='not-italic font-medium text-base leading-6 text-gray-700'>Nombre del estudio</p>
        <InputTextField id='studyName' inputText={inputName} setInputText={setInputName} />
      </div>
      {/* reason of the study */}
      <div className='flex flex-col space-y-1'>
        <p className='not-italic font-medium text-base leading-6 text-gray-700'>Motivo del estudio</p>
        <InputTextField id='studyReason' inputText={inputReason} setInputText={setInputReason} />
      </div>
      {/* date and category */}
      <div className='flex flex-row space-x-32'>
        {/* date */}
        <div className='flex flex-col space-y-3 relative'>
          <p className='not-italic font-medium text-base leading-6 text-gray-700'>Fecha del estudio</p>
          <button className='focus:outline-none' onClick={handleClick}>
            <div className='flex flex-row space-x-2'>
              {inputDate ? moment(inputDate).format('DD-MM-YYYY') : 'Establecer fecha'}
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
                className='focus:outline-none not-italic font-medium text-sm leading-6 text-gray-500 z-50 w-28'
                dateFormat='dd-MM-yyyy'
                locale='es'
                selected={inputDate}
                onChange={date => handleDateChange(date)}
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
        <div className='w-max-content'>
          <ListboxCustom
            data={Categories}
            label='Seleccione una categoria'
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        </div>
      </div>
      {/* notes */}
      <div className='flex flex-col space-y-1'>
        <p className='not-italic font-medium text-base leading-6 text-gray-700'>Notas (opcional)</p>
        <InputTextField
          id='notes'
          inputText={inputNotes}
          setInputText={setInputNotes}
          placeholder='Anotaciones sobre el estudio'
        />
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
              type='file'
              multiple
              accept='.pdf, .jpeg, .jpg, .png'
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={e => handleFilesSelected(e.target.files)}
            />
            <button className='focus:outline-none rounded-lg p-2 hover:bg-gray-100' onClick={handleButtonClick}>
              <div className='flex flex-row items-center space-x-2'>
                <p className='not-italic font-normal text-base leading-6 text-teal-400'>Añadir archivo</p>
                <PlusIcon />
              </div>
            </button>
          </div>
          {/* list of existing files */}
          {attachmentFilesForm.length > 0 && <div className='flex flex-col space-y-2 p-2'>{renderFileList()}</div>}
        </div>
      </div>
    </div>
  )
}

export default StudyForm
