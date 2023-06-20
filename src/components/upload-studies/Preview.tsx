import React, { useEffect, useState } from 'react'
import { FilesToShow } from './OrderImported'
import Modal from '../Modal';
import CloseIcon from '@material-ui/icons/Close';

type Props = {
  file: FilesToShow | File;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const Preview = (props: Props) => {
  const {file, showModal, setShowModal} = props
  const [fileUrl, setFileUrl] = useState<string>()

  useEffect(() => {
    if(file instanceof File) {
      let fileReader = new FileReader()

      fileReader.onload = event => {
        const url = event.target?.result as string

        setFileUrl(url)
      }

      fileReader.readAsDataURL(file) 
    }
  }, [file])

  return (
    <Modal show={showModal} setShow={setShowModal} size='xl5' noPadding={true} >
      <div className='w-full p-1'>
        <div className='flex flew-row w-full justify-end mb-2'>
          <button className='focus:outline-none' onClick={() => setShowModal(false)}>
            <CloseIcon className='focus:outline-none' />
          </button>
        </div>
        <div className='flex flex-row justify-center items-center w-full'>
          {
            file instanceof File
              ? file.type.includes('pdf')
                ? <object className='w-full' height='500' data={fileUrl} type={file.type} aria-labelledby={file?.name ?? ''} />
                : <img className='w-2/4' src={fileUrl} alt='img'/>
              : file?.contentType?.includes('pdf')
                ? <object className='w-full' height='500' data={file?.url ?? ''} type={file?.contentType ?? ''} aria-labelledby={file?.title ?? ''} />
                : <img className='w-2/4' src={file?.url ?? ''} alt='img'/>
          }
        </div>
      </div>
    </Modal>
  )
}

export default Preview