import moment from "moment"
import React from "react"
import { SOURCE_TYPE_STUDY, STUDY_TYPE } from "../../util/constants"
import { countDays, toUpperLowerCase } from "../../util/helpers"
import { StudyType, getCategorySvg } from "./StudyHistory"



type PropsCardStudy = {
  study?: StudyType,
  isSelectecStudy?: boolean,
  setSelectedStudy?: (study: StudyType) => void
  darkMode?: boolean,
}

export const CardStudy: React.FC<PropsCardStudy> = (
  {
    study,
    isSelectecStudy,
    setSelectedStudy,
    darkMode = false,
    ...props
  }
) => {

  const getMessageSource = () => {
    if (study?.type === STUDY_TYPE.WITH_ORDER) {
      return `Solicitado por el/la Dr/Dra ${toUpperLowerCase(study.sourceName) ?? ''}`
    } else if (study.type === STUDY_TYPE.WITHOUT_ORDER) {
      if (study?.sourceType === SOURCE_TYPE_STUDY.patient)
        return `Subido por el paciente ${toUpperLowerCase(study.sourceName) ?? ''}`
      if (study?.sourceType === SOURCE_TYPE_STUDY.practitioner)
        return `Subido por ${toUpperLowerCase(study.sourceName) ?? ''}`
      if (study?.sourceType === SOURCE_TYPE_STUDY.organization)
        return `Subido por la organización ${toUpperLowerCase(study.sourceName) ?? ''}`
      return `Subido por ${toUpperLowerCase(study.sourceName) ?? 'Desconocido'}`
    }
  }

  const classTextDarkMode = `${darkMode ? 'text-white group-hover:text-cool-gray-700' : 'text-cool-gray-700'}`
  const classTextCountDaysDarkMode = `${darkMode ? 'text-white group-hover:text-gray-400' : 'text-cool-gray-700'}`

  return (
    <div className={`flex flex-col p-2 group ${isSelectecStudy ? 'bg-bluish-500' : 'hover:bg-neutral-gray'} rounded-lg`}
      style={{
        minWidth: '250px',
        maxHeight: '171px',
        gap: '10px',
        transition: 'background-color 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={() => { setSelectedStudy(study) }}
    >
      {/* Head */}
      <div className='flex flex-row items-center gap-2'>
        {getCategorySvg(study?.category, 36, 36, darkMode)}
        <h2
          className={`font-normal ${classTextDarkMode}`}
          style={{ fontSize: '20px' }}
        >
          {study?.category}
        </h2>
      </div>

      {/* Studies added */}
      {study?.type === 'serviceRequest' &&
        <div className={`flex flex-row px-1 py-2 text-dark-cool text-sm 
        ${isSelectecStudy ? 'bg-primary-100 text-green-darker' :
            'bg-ghost-white group-hover:bg-primary-100 group-hover:text-green-darker'} items-center`} style={{
              width: '164px',
              height: '26px',
              borderRadius: '1000px',
              lineHeight: '16px',
              letterSpacing: '0.1px',
              transition: 'background-color 0.3s ease-out, color 0.3s ease-out'

            }}>
          {`${study?.diagnosticReportAttachmentCount} resultados añadidos`}
        </div>
      }

      {/* study container */}
      <div className='flex flex-col gap-1' style={{ minWidth: '56px' }}>
        <div className={`truncate font-semibold text-sm ${classTextDarkMode}`}
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
          title={study?.description}
        >
          {study?.description}
        </div>
        <div className={`'w-56 truncate font-normal text-xs ${classTextDarkMode}`}
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
          title={getMessageSource()}
        >
          {getMessageSource()}
        </div>
      </div>

      {/* Footer */}
      <div className='flex flex-row gap-2 h-4'>
        <div className={`text-sm ${classTextDarkMode} `}
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {study?.authoredDate && moment(study.authoredDate).format('DD/MM/YYYY')}
        </div>
        <div className={`${classTextCountDaysDarkMode}`}
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {study?.authoredDate && countDays(study.authoredDate)}
        </div>
      </div>
      <span style={{
        borderBottom: darkMode ? '1px solid rgba(246, 244, 244, 0.2)' : '2px solid #F7F4F4',
      }}></span>
    </div>
  )
}