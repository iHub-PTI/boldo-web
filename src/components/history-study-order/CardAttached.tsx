import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import React, { useState } from 'react';
import { ReactComponent as Spinner } from "../../assets/spinner.svg";
import handleSendSentry from "../../util/Sentry/sentryHelper";
import Modal from '../Modal';
import { useToasts } from "../Toast";
import ChevronRight from '../icons/ChevronRight';
import EyeIcon from '../icons/EyeIcon';
import ArrowDownWardIcon from '../icons/filter-icons/ArrowDownWardIcon';
import PdfIcon from '../icons/study_icon/PdfIcon';
import PictureIcon from '../icons/study_icon/PictureIcon';
import { getOrigin } from './StudyHistory';

export type AttachmentUrlType = {
  contentType: string;
  title: string;
  url: string;
}

type CardAttachedProps = {
  fileData: AttachmentUrlType,
  effectiveDate: string;
  sourceType: string
}

export const CardAttached: React.FC<CardAttachedProps> = ({ fileData, ...props }) => {

  const { addToast } = useToasts()

  const [loadingDownload, setLoadingDownload] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState<AttachmentUrlType>()

  const getIconFile = (type: string) => {
    if (!type) return
    if (type.includes('image')) return <PictureIcon width={18} height={18} />
    if (type === 'application/pdf') return <PdfIcon width={20} height={20} />
  }

  const getDateOrigin = (date) => {
    if (!date) return ''
    return moment(date).format('DD/MM/YYYY')
  }

  const downloadBlob = (url, title, contentType) => {
    setLoadingDownload(true)
    const oReq = new XMLHttpRequest();
    oReq.open('GET', url, true);
    oReq.responseType = 'blob';

    oReq.onload = function () {
      if (oReq.status === 200) {
        const file = new Blob([oReq.response], { type: contentType });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = title;
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(fileURL);
          document.body.removeChild(a);
        }, 0);
      } else {
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al descargar el archivo. Inténtalo luego más tarde' })
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        handleSendSentry(oReq.onerror, 'Ha ocurrido un error al descargar el archivo', tags)
      }
      setLoadingDownload(false)
    };
    oReq.send();

  };

  return <div className='flex flex-col w-full h-16 bg-bluish-500 rounded-lg  py-3 px-3 gap-2'>
    <div className='flex flex-row'>
      <div className='flex flex-row gap-1 items-center'>
        {getIconFile(fileData?.contentType)}
        <div className='ml-1 w-48 sm:w-48 md:w-48 lg:w-64 font-medium text-sm truncate'
          title={fileData.title}
          style={{
            lineHeight: '17px',
            color: '#424649'
          }}>
          {fileData.title}
        </div>
        <ChevronRight width={6} height={9} />
      </div>
      <div className='flex flex-row flex-1 items-center justify-end pr-4 gap-3'>
        <button className='focus:outline-none' onClick={() => {
          setShowModal(true)
          setPreview({ url: fileData.url, title: fileData.title, contentType: fileData.contentType })
        }}>
          <EyeIcon width={18} height={12} />
        </button>
        <button className='focus:outline-none' onClick={() => downloadBlob(fileData.url, fileData.title, fileData.contentType)}>
          {!loadingDownload && <ArrowDownWardIcon width={13} height={13} />}
          {loadingDownload && <Spinner className='text-gray-700 animate-spin w-4 h-4' />}
        </button>
      </div>
    </div>
    <div className='flex flex-row gap-2'>
      <span
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          letterSpacing: '0.1px'
        }}
      >{getOrigin(props.sourceType)}</span>
      <span
        className='text-dark-cool'
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          letterSpacing: '0.1px'
        }}>{getDateOrigin(props.effectiveDate)}</span>
    </div>

    <Modal show={showModal} size='xl5' setShow={setShowModal} noPadding={true}>
      <div className='w-full p-1'>
        <div className='flex flew-row h-5 w-full justify-end mb-2'>
          <button className='focus:outline-none' onClick={() => setShowModal(false)}>
            <CloseIcon className='focus:outline-none'></CloseIcon>
          </button>
        </div>
        <div className='flex flex-row justify-center items-center w-full'>
          {preview &&
            preview.contentType.includes('pdf') ?
            <object className='w-full' data={preview.url} width="700" height="700" type="application/pdf" aria-labelledby={preview.title}></object> : preview &&
            <img className='w-2/4' src={preview.url} alt="img" />}
        </div>
      </div>
    </Modal>
  </div>
}
