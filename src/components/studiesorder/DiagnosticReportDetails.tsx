import moment from 'moment'
import React from 'react'
import Boldo from '../../types'
import { countDays } from '../../util/helpers'
import ClipIcon from '../icons/ClipIcon'
import FileCard from './Cards/FileCard'


 type Props = { 
  reportDetails: Boldo.DiagnosticReportDetails 
}

const DiagnosticReportDetails = ({reportDetails}: Props) => {
  return (
    <div className='flex flex-col'>
      {/* title of column */}
      <div className='pl-1 pb-4'>
        <span className='font-semibold'>Análisis de laboratorio</span>
      </div>
      {/* date */}
      <div className='pl-1 pb-4 flex flex-col'>
        <span className='text-gray-50'>Realizado en fecha</span>
        {/* date and days */}
        <div className='flex flex-row gap-2'>
          {/* date in format DD/MM/YYY  */}
          <span>{moment(reportDetails.effectiveDate).format('DD/MM/YYYY')}</span>
          {/* days */}
          <span>{countDays(reportDetails.effectiveDate.toString())}</span>
        </div>
      </div>
      {/* source */}
      <div className='pl-1 pb-4 flex flex-col'>
        <span className='text-gray-50'>Origen</span>
        <span>{reportDetails.source}</span>
      </div>
      {/* attachments */}
      <div className='flex flex-col pl-1'>
        {/* icon and text */}
        <div className='flex flex-row content-center'>
          <ClipIcon />
          <span className='font-semibold text-sm ml-1'>Adjuntos</span>
        </div>
        {/* here attachments */}
        <div className='p-2 w-full'>
          {
            reportDetails.attachmentUrls.map((file, index) => {
              return <FileCard key={index} file={file}/>
            })
          }
        </div>
      </div>
    </div>
  )
}


export default DiagnosticReportDetails