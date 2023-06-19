import React, { useContext, useEffect, useRef, useState } from 'react';
import { OrderStudyImportedContext } from '../../contexts/OrderImportedContext';
import { AttachmentFilesContext } from '../../contexts/AttachmentFiles';
import { useToasts } from '../Toast';
import DeleteOrderImported from '../icons/upload-icons/DeleteOrderImported';
import DateSection from './DateSection';
import DoctorProfile from './DoctorProfile';
import Category from './Category';
import Urgency from './Urgency';
import AttachmentIcon from '../icons/upload-icons/AttachmentsIcon';
import PlusIcon from '../icons/upload-icons/PlusIcon';
import axios from 'axios';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import StudyCard from './StudyCard';
import DeleteConfirm from './DeleteConfirm';


type Props = {
  handleShowOrderImported: () => void;
  setLoadingSubmit: (loading: boolean) => void;
  saveRef: React.MutableRefObject<HTMLButtonElement>;
  searchRef: React.MutableRefObject<HTMLInputElement>;
}

type Presigned = {
  uploadUrl: string;
  location: string;
}

export type FilesToShow = Boldo.AttachmentUrl & {date: string} & {source: string} & {new: boolean} & {sourceType: string} & {gender?: string}


const OrderImported = (props: Props) => {
  const {handleShowOrderImported, saveRef, setLoadingSubmit, searchRef} = props
  const {OrderImported, setOrderImported, patientId} = useContext(OrderStudyImportedContext)
  const {attachmentFiles, setAttachmentFiles} = useContext(AttachmentFilesContext)
  const { addToast } = useToasts()
  const [filesState, setFilesState] = useState<FilesToShow[]>([])
  // handle delete modal
  const [showModal, setShowModal] = useState<boolean>(false)
  let filesToShow: FilesToShow[] = [] as FilesToShow[]
  // this reference we use to simulate the click on the custom button
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const CategoryMap = {
    "DIAGNOSTIC IMAGING": "IMAGE",
    "LABORATORY": "LABORATORY",
    "OTHER": "OTHER",
    "": "OTHER"
  }

  const deleteMessage = '¿ Está seguro que quiere anular la importación de la orden ?'

  const handleSearchClick = () => {
    searchRef.current.click()
  }

  const getUploadUrl = (): Promise<Presigned> => {
    let url = '/presigned'

    return new Promise(async (resolve, reject) => {
      await axios
        .get(url)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          const tags = {
            'endpoint': url,
            'method': 'GET'
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
        headers: { 'Content-Type': file.type, authentication: null }
      })
      .then((res) => {
        if (res.status === 201) {
          resolve({
            contentType: file.type,
            // title: file.name,
            url: presigned.location
          })
        } else if (res.status === 413) {
          // the file is bigger than 10MB
          reject({} as Boldo.AttachmentUrl)
        }
      })
      .catch((err) => {
        const tags = {
          'upload-url': presigned.uploadUrl,
          'method': 'PUT'
        }
        handleSendSentry(err, ERROR_HEADERS.FILE.FAILURE_UPLOAD, tags)
        // console.log("ERROR IN UPLOAD FILE => ", err)
      })
    })
  }

  const uploadStudy = (attachmentUrls: Boldo.AttachmentUrl[]): Promise<boolean> => {
    if (!attachmentUrls) return

    let url = '/profile/doctor/diagnosticReport'
    
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return new Promise((resolve, reject) => {
      axios
      .post(url, {
        attachmentUrls: attachmentUrls,
        category: CategoryMap[OrderImported?.category?.toUpperCase() ?? ''],
        // conclusion: OrderImported.diagnosis,
        description: OrderImported?.studiesCodes?.map((study) => study.display)?.join(', ') ?? '',
        effectiveDate: formattedDate,
        patientId: patientId,
        serviceRequestId: OrderImported.id,
      })
      .then((res) => {
        if (res.status === 201) resolve(true)
      })
      .catch((err) => {
        const tags = {
          'endpoint': url,
          'method': 'POST'
        }
        handleSendSentry(err, ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_POST, tags)
        reject(false)
      })
    })
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFilesSelected = (files: FileList | null) => {
    if (files) {
      // define the array of exitsting files
      const existingFileList = Array.from(attachmentFiles)
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
      setAttachmentFiles(updatedList.files)

      // console.log("Archivos seleccionados => ", files)
      
    }
  }

  const renderFileList = () => {
    let arrayOfFiles = Array.from(attachmentFiles)

    const renderedFiles = arrayOfFiles.map((file, index) => {
      return  <StudyCard 
                key={index}
                file={file}
                index={index}
              />
    })

    return renderedFiles;
  }

  const confirmDelete = () => {
    handleShowOrderImported()
    setOrderImported({} as Boldo.OrderStudy)
  }

  useEffect(() => {
    if (OrderImported) {
      setAttachmentFiles(new DataTransfer().files)
      let gender = OrderImported?.doctor?.gender ?? 'empty'
      // one diagnostic report per sources
      OrderImported?.diagnosticReports?.forEach((report) => {
        let source = report?.source ?? ''
        let sourceType = report?.sourceType ?? ''
        let date = report?.effectiveDate ?? ''
        // list of attachment url
        report?.attachmentUrls?.forEach((attachment) => {
          filesToShow.push({
            title: attachment?.title ?? 'Sin título',
            contentType: attachment?.contentType ?? '',
            url: attachment?.url ?? '',
            date: date,
            source: source,
            sourceType: sourceType,
            gender: sourceType === 'Practitioner' ? gender : 'empty',
            new: false
          })
          filesToShow.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setFilesState(filesToShow)
        })
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OrderImported])

  useEffect(() => {
    const button = saveRef.current

    const handleButtonClick = async () => {
      
      if (attachmentFiles.length > 0) {
        // init the submit
        setLoadingSubmit(true)

        let attachmentUrls: Boldo.AttachmentUrl[] = []
      
        for (let i = 0; i < attachmentFiles.length; i++) {
          let presigned: Presigned = await getUploadUrl()
          
          const file = attachmentFiles[i]
          
          let attachmentUrl = await uploadFile(file, presigned)

          attachmentUrls.push(attachmentUrl)
        }
        
        let response = await uploadStudy(attachmentUrls)

        setLoadingSubmit(false)
        // when all its ok, is redirected to order study search
        if (response) {
          addToast({type: 'info', title: 'Operación exitosa.', text: 'Resultado adjuntado correctamente.'})
          handleSearchClick()
        } else {
          addToast({type: 'error', title: 'Ocurrió un error.', text: 'No se han podido adjuntar los estudios. Por favor, vuelva a intentarlo más tarde.'})
        }

      } else if (attachmentFiles.length === 0) {
        addToast({type: 'info', title: 'Atención', text: 'Debe agregar al menos un estudio para subirlo.'})
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
  }, [saveRef, attachmentFiles])


  return(
    <div className='flex flex-col space-y-8 p-5'>
      <DeleteConfirm showModal={showModal} setShowModal={setShowModal} confirmDelete={confirmDelete} msg={deleteMessage} />
      {/* the order was imported */}
      <div className='flex flex-row justify-between border-b-2'>
        { OrderImported?.orderNumber &&
          <p className='not-italic font-medium text-base leading-6'>
            {
              OrderImported?.orderNumber === 'studyOrderMain'
                ? 'Número de orden no definido' 
                : `Orden ${OrderImported?.orderNumber && `Nro ${OrderImported.orderNumber} `}seleccionada`
            }
          </p>
        }
        <button
          className='focus:outline-none'
          onClick={() => {
            setShowModal(true)
          }}
        >
          <DeleteOrderImported />
        </button>
      </div>
      {/* profile and date */}
      <div className='flex flex-row justify-between'>
        {/* profile */}
        <DoctorProfile doctor={OrderImported?.doctor as unknown as Omit<iHub.Doctor, "specializations"> & { specializations: iHub.Specialization[] }} organization={OrderImported?.organization as Boldo.OrganizationInOrderStudy} />
        {/* date section */}
        <DateSection authoredDate={OrderImported?.authoredDate} />
      </div>
      {/* diagnosis */}
      { OrderImported?.diagnosis &&
        <div className='flex flex-col space-y-1'>
          <p className='not-italic font-normal text-base leading-4 text-teal-400'>Diagnóstico</p>
          <p className='not-italic font-semibold text-sm leading-4 text-black'>{OrderImported.diagnosis}</p>
        </div>
      }
      {/* requested studies and attachments */}
      <div className='flex flex-col space-y-6'>
        <p className='not-italic font-normal text-base leading-4 text-teal-400'>Estudios Solicitados</p>
        <div className='flex flex-col space-y-5 px-4'>
          {/* requested studies */}
          <div className='flex flex-col space-y-1'>
            {/* category and urgency */}
            <div className='flex flex-row space-x-4'>
              <Category category={OrderImported?.category ?? ''}/>
              {OrderImported?.urgent && <Urgency />}
            </div>
            {/* list of requested studies */}
            {OrderImported?.studiesCodes?.map((code, idx) => (<li key={idx} className='not-italic font-normal text-sm leading-4 text-gray-700'>{code?.display ?? ''}</li>))}
          </div>
          {/* observations */}
          { OrderImported?.notes &&
            <div className='flex flex-col space-y-2'>
              <p className='not-italic font-normal text-sm leading-5 text-gray-700'>Observaciones:</p>
              <p className='not-italic font-normal text-sm leading-5 text-gray-700'>{OrderImported.notes}</p>
            </div>
          }
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
              {/* list of attchment files */}
              {
                renderFileList()
              }
              {/* list of existing files */}
              { filesState.length > 0 &&
                <div className='flex flex-col space-y-2 p-2'>
                  {
                    filesState.map((file, idx) => {
                      return <StudyCard 
                                key={idx}
                                file={file}
                                index={idx}
                              />
                    })
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default OrderImported;