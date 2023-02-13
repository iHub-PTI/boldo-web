import React, { useState } from 'react'
import { downloadBlob, getFileUrl } from '../../../util/helpers'
import CloseIcon from '../../icons/CloseIcon'
import DownloadIcon from '../../icons/DownloadIcon'
import ImageIcon from '../../icons/ImageIcon'
import PdfIcon from '../../icons/PdfIcon'
import PreviewIcon from '../../icons/PreviewIcon'
import Modal from '../../Modal'

type Props = {
  file: Boldo.AttachmentURL
}

export type Preview = {
  contentType: string
  url: string
}

const FileCard = ({ file }: Props) => {
  const { contentType, title, url } = file
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showPreview, setShowPreview] = useState<Preview>({} as Preview)

  return (
    // card container
    <div className='flex flex-row flex-wrap rounded-lg mb-2 items-center justify-between bg-white'>
      <div className='flex flex-row items-center' style={{ maxWidth: '250px' }}>
        {/* icon */}
        {contentType.includes('pdf') ? <PdfIcon svgClass='pl-1' /> : <ImageIcon svgClass='pl-1' />}
        {/* filename */}
        <span className='truncate text-sm pl-1' style={{ maxWidth: '220px' }}>
          {title ?? 'documento'}
        </span>
      </div>
      <div className='flex flex-row m-2'>
        {/* Download option */}
        <button
          className='items-center justify-center mr-2 rounded-full focus:outline-none focus:bg-gray-600'
          onClick={() => {
            downloadBlob(url, contentType, title)
          }}
        >
          <DownloadIcon />
        </button>
        {/* Preview option */}
        <button
          className='items-center justify-center rounded-full focus:outline-none focus:bg-gray-600'
          onClick={() => {
            setShowEditModal(true)
            if (contentType.includes('pdf')) {
              getFileUrl(url, contentType, setShowPreview)
            } else {
              setShowPreview({ contentType: contentType, url: url })
            }
          }}
        >
          <PreviewIcon />
        </button>
      </div>
      <Modal show={showEditModal} setShow={setShowEditModal} size='xl3' bgTransparent={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: '0.5rem',
          }}
        >
          <button
            onClick={() => {
              setShowEditModal(false)
            }}
          >
            <CloseIcon />
          </button>
        </div>
        {console.log("show preview => ", showPreview)}
        {
          showPreview['contentType'] !== undefined && showPreview['contentType'].includes('pdf') 
            // eslint-disable-next-line jsx-a11y/alt-text
            ? <object data={showPreview['url']} width='700' height='700' type='application/pdf'></object>
            : <img src={showPreview['url']} alt='img' />
        }
      </Modal>
    </div>
  )
}

export default FileCard
