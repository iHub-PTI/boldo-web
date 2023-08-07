import React, { useState } from 'react';
import moment from 'moment';
import ChevronRight from '@material-ui/icons/ChevronRight';
import PdfIcon from '../icons/upload-icons/PdfIcon';
import ImageIcon from '../icons/upload-icons/ImageIcon';
import PreviewIcon from '../icons/upload-icons/PreviewIcon';
import TrashIcon from '../icons/upload-icons/TrashIcon';
import { toUpperLowerCase } from '../../util/helpers';
import { FilesToShow } from './OrderImported';
import Preview from './Preview';


type Props = {
  file: FilesToShow | File;
  index: number;
  attachmentFiles: FileList;
  setAttachmentFiles: (value: FileList) => void;
}


const StudyCard = ( props: Props ) => {
  const {file, index, attachmentFiles, setAttachmentFiles} = props

  const [showModal, setShowModal] = useState<boolean>(false)


  const handleFileDelete = (index: number) => {
    // define the array of exitsting files
    const existingFileList = Array.from(attachmentFiles)
    // create an auxiliar list
    const updatedList = new DataTransfer()

    existingFileList.splice(index, 1)
    // to add the new files
    existingFileList.forEach((file) => updatedList.items.add(file))
    // and then we assign it again
    setAttachmentFiles(updatedList.files)

  }

  return(
    <div 
      className='flex flex-row justify-between items-center rounded-xl p-2'
      style={{
        background: "#F4F5F7"
      }}
    >
      {/* icon, name and footer descriptions */}
      <div className='flex flex-col space-y-1'>
        {/* icon and name */}
        <div className='flex flex-row space-x-1 items-center'>
          {/* ICON */}
          <div>
            { 
              file instanceof File
                ? file.type.includes('pdf')
                  ? <PdfIcon />
                  : <ImageIcon />
                : file?.contentType?.includes('pdf')
                  ? <PdfIcon />
                  : <ImageIcon />
            }
          </div>
          {/* NAME OF THE FILE */}
          <p 
            className='not-italic font-medium text-sm leading-4'
            style={{
              color: "#424649"
            }}
          >
            {
              file instanceof File
                ? file.name
                : file?.title ?? 'Nombre desconocido'
            }
          </p>
          <ChevronRight height={24}/>
        </div>
        {/* description */}
        { !(file instanceof File) &&
          <div className='flex flex-row items-center space-x-1'>
            {/* source */}
            <p className='not-italic font-medium text-xs leading-4'>{file?.source !== '' ? `Subido por ${file.sourceType === 'Practitioner' ? file.gender === 'female' ? 'Dra.' : 'Dr.' : ''} ${toUpperLowerCase(file.source)}` : 'Nombre desconocido'}</p>
            {/* date */}
            <p className='not-italic font-medium text-xs leading-4'>{file?.date !== '' ? `${moment(file.date).format('DD/MM/YYYY')}` : 'Fecha desconocida'}</p>
          </div>
        }
      </div>
      {/* actions */}
      <div className='flex flex-row space-x-2 items-center'>
        <button
          className='focus:outline-none'
          onClick={() => setShowModal(true)}
        >
          <PreviewIcon />
        </button>
        { (file instanceof File) &&
          <button
            className='focus:outline-none'
            onClick={() => handleFileDelete(index)}
          >
            <TrashIcon />
          </button>
        }
      </div>
      <Preview file={file} showModal={showModal} setShowModal={setShowModal}  />
    </div>
  );
}

export default StudyCard;