import React, { useContext } from 'react';
import moment from 'moment';
import { AttachmentFilesContext } from '../../contexts/AttachmentFiles';
import ChevronRight from '@material-ui/icons/ChevronRight';
import PdfIcon from '../icons/upload-icons/PdfIcon';
import ImageIcon from '../icons/upload-icons/ImageIcon';
import PreviewIcon from '../icons/upload-icons/PreviewIcon';
import TrashIcon from '../icons/upload-icons/TrashIcon';


type Props = {
  name: string;
  source: string;
  date: string;
  isNew: boolean;
  type?: string;
  index: number;
}


const StudyCard = (props: Props) => {
  const {name='', source='', date='', isNew=true, type='', index} = props
  const {attachmentFiles ,setAttachmentFiles} = useContext(AttachmentFilesContext)

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
            { isNew
              ? type.includes('pdf')
                ? <PdfIcon />
                : <ImageIcon />
              : name.includes('.pdf')
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
            {name !== '' ? name : 'Nombre desconocido'}
          </p>
          <ChevronRight height={24}/>
        </div>
        {/* description */}
        { !isNew &&
          <div className='flex flex-row items-center space-x-1'>
            {/* source */}
            <p className='not-italic font-medium text-xs leading-4'>{source !== '' ? `Subido por ${source}` : 'Nombre desconocido'}</p>
            {/* date */}
            <p className='not-italic font-medium text-xs leading-4'>{date !== '' ? `${moment(date).format('DD/MM/YYYY')}` : 'Fecha desconocida'}</p>
          </div>
        }
      </div>
      {/* actions */}
      <div className='flex flex-row space-x-2 items-center'>
        <button
          className='focus:outline-none'
        >
          <PreviewIcon />
        </button>
        { isNew &&
          <button
            className='focus:outline-none'
            onClick={() => handleFileDelete(index)}
          >
            <TrashIcon />
          </button>
        }
      </div>
    </div>
  );
}


export default StudyCard;