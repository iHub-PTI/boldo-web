import moment from "moment";
import React, { useEffect, useState } from "react";
import { DiagnosticReport } from "../../../types";
import { countDays } from "../../../util/helpers";
import IconImg from "../../icons/studies-category/IconImg";
import IconLab from "../../icons/studies-category/IconLab";
import IconOther from "../../icons/studies-category/IconOther";


const categoryIssuedOrders = {
  LABORATORY: 'Laboratory',
  IMAGE: 'Diagnostic Imaging',
  OTHER: 'Other'
}

const DiagnosticReportCard = ({
  selected = false,
  report = {} as DiagnosticReport,
  getReportDetail = (id: string) => { },
  onActiveId = (id: string) => { },
  darkMode = false,
  onShowReportDetail = () => { },
  isCall = false,
  ...props
}) => {

  const [background, setBackground] = useState('#EDF2F7')

  const updateBackground = () => {
    if (!selected) setBackground('')
    if (selected && darkMode) setBackground('rgba(248, 255, 255, 0.15)')
  }

  useEffect(() => {
    updateBackground()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode, selected])

  return (
    // all the card
    <div
      className={`flex flex-row pl-1 pt-1 ${isCall ? 'w-full' : 'w-64'} h-28 rounded-lg group cursor-pointer mb-1 mx-1 truncate pr-1`}
      style={{
        backgroundColor: background,
        minHeight: '102px'
      }}
      onClick={() => {
        getReportDetail(report.id)
        onActiveId(report.id)
        onShowReportDetail()
      }}
      onMouseOver={() => { setBackground('#f4f5f7') }}
      onMouseLeave={() => { updateBackground() }}
      {...props}
    >
      {/* first column - icon for type of category */}
      <div className='flex flex-col w-2/12 m-1'>
        { report &&
          (report.category.toLowerCase() === categoryIssuedOrders.LABORATORY.toLowerCase()
            ? <IconLab height={24} width={24}/>
            : report.category.toLowerCase() === categoryIssuedOrders.IMAGE.toLowerCase()
              ? <IconImg height={24} width={24}/>
              : <IconOther height={24} width={24}/>
          )
        }
      </div>
      {/* second column */}
      <div className='flex flex-col w-full break-all'>
        {/* title for type of category */}
        <div
          className={`font-semibold text-base truncate w-full ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
        >
          {report &&
            (report.category.toLowerCase() === categoryIssuedOrders.LABORATORY.toLowerCase()
              ? 'Laboratorio'
              : report.category.toLowerCase() === categoryIssuedOrders.IMAGE.toLowerCase()
                ? 'Imagen'
                : 'Otros'
            )
          }
        </div>
        {/* description of the study */}
        <div
          className={`text-base mr-1 pb-1 truncate ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
          title={report.description ?? 'No se ha agregado la descripción'}
        >
          {report.description ?? 'Sin descripción'}
        </div>
        {/* source of the study - row of information (patient or anyone) */}
        <div className='flex flex-row w-full'>
          {/* highlighted text */}
          <span className={`font-normal group-hover:text-primary-500 ${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'} mr-1`}>Subido por:</span>
          {/* source */}
          <div 
            className={`${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
            title={report.source ?? 'Origen desconocido'}
          >
              {report.source ?? 'Origen desconocido'}
          </div>
        </div>
        {/* row that contains date and number of the days elapsed */}
        <div className='flex flex-row gap-2'>
          {/* date */}
          <div className={`font-normal ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}>
            {moment(report.effectiveDate).format('DD/MM/YYYY')}
          </div>
          {/* number of the days */}
          <div 
            className={`${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'}`}
          >
            {countDays(report.effectiveDate.toString())}
          </div>
        </div>
        <span className='w-full h-0' style={{ borderBottom: darkMode ? '1px solid rgba(247, 244, 244, 0.2)' : '1px solid #F7F4F4' }}></span>
      </div>
    </div>
  );
}


export default DiagnosticReportCard