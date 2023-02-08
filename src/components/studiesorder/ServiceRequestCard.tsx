import moment from "moment";
import React, { useEffect, useState } from "react";
import { ServiceRequest } from "../../types";
import { countDays, toUpperLowerCase } from "../../util/helpers";
import IconImg from "../icons/studies-category/IconImg";
import IconLab from "../icons/studies-category/IconLab";
import IconOther from "../icons/studies-category/IconOther";


const categoryIssuedOrders = {
  LABORATORY: 'Laboratory',
  IMAGE: 'Diagnostic Imaging',
  OTHER: 'Other'
}

const ServiceRequestCard = ({
  selected = false,
  study = {} as ServiceRequest,
  getServiceRequestDetail = (id: string) => { },
  onActiveId = (id: string) => { },
  darkMode = false,
  onShowStudyDetail = () => { },
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
    <div
      className={`flex flex-row pl-1 pt-1 ${isCall ? 'w-full' : 'w-64'} h-28 rounded-lg group cursor-pointer mb-1 mx-1 truncate pr-1`}
      style={{
        backgroundColor: background,
        minHeight: '102px'
      }}
      onClick={() => {
        // getRecordPatientDetail(patientRecord.encounterDto.id)
        // onActiveID(patientRecord.encounterDto.id)
        // onShowDetail()
      }}
      onMouseOver={() => { setBackground('#f4f5f7') }}
      onMouseLeave={() => { updateBackground() }}
      {...props}
    >
      <div className='flex flex-col w-2/12 m-1'>
        {console.log("study => ", study)}
        {
          study.category === categoryIssuedOrders.LABORATORY
            ? <IconLab height={24} width={24}/>
            : study.category === categoryIssuedOrders.IMAGE
              ? <IconImg height={24} width={24}/>
              : <IconOther height={24} width={24}/>
        }
      </div>
      <div className='flex flex-col w-full break-all'>
        <div
          className={`font-semibold text-base truncate w-full ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
        >
          {
            study.category === categoryIssuedOrders.LABORATORY
              ? 'Laboratorio'
              : study.category === categoryIssuedOrders.IMAGE
                ? 'Imagen'
                : 'Otros'
          }
        </div>
        <div className={`flex flex-row w-full`}>
          <span className={`font-normal group-hover:text-primary-500 ${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'} mr-1`}>Impresión diagnóstica:</span>
          <div 
            className={`${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
            title={study.diagnosis ?? 'No se ha agregado la impresión diagnóstica'}
          >
              {study.diagnosis ?? 'Sin impresión diagnóstica'}
          </div>
        </div>
        <div
          className={`text-base pb-1 truncate ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}
          title={toUpperLowerCase(study.studiesCodes.map(code => code.display).join(', '))}
        >
          {toUpperLowerCase(study.studiesCodes.map(code => code.display).join(', '))}
        </div>
        <div className='flex flex-row gap-2'>
          <div className={`font-normal ${darkMode ? 'group-hover:text-gray-700 text-white' : 'text-gray-700'}`}>
            {moment(study.authoredDate.split('T')[0]).format('DD/MM/YYYY')}
          </div>
          <div className={`${darkMode ? 'group-hover:text-gray-500 text-white' : 'text-gray-500'}`}>{countDays(study.authoredDate.split('T')[0])}</div>
        </div>
        <span className='w-full h-0' style={{ borderBottom: darkMode ? '1px solid rgba(247, 244, 244, 0.2)' : '1px solid #F7F4F4' }}></span>
      </div>
    </div>
  );
}


export default ServiceRequestCard