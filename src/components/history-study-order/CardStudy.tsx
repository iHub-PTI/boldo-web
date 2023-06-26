import moment from "moment"
import React from "react"
import { SOURCE_TYPE_STUDY, STUDY_TYPE } from "../../util/constants"
import { countDays, toUpperLowerCase } from "../../util/helpers"
import { StudyType, getCategorySvg } from "./StudyHistory"

type PropsCardStudy = {
  study?: StudyType,
  isSelectecStudy?: boolean,
  setSelectedStudy?: (study: StudyType) => void
}

export const CardStudy: React.FC<PropsCardStudy> = (
  {
    study,
    isSelectecStudy,
    setSelectedStudy,
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

  return (
    <div className={`flex flex-col p-2 group ${isSelectecStudy ? 'bg-bluish-500' : 'hover:bg-neutral-gray'} rounded-lg`}
      style={{
        width: '250px',
        maxHeight: '171px',
        gap: '10px',
        transition: 'background-color 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={() => { setSelectedStudy(study) }}
    >
      {/* Head */}
      <div className='flex flex-row items-center gap-2'>
        {getCategorySvg(study?.category, 27, 27)}
        <h2 className='text-cool-gray-700 font-normal'
          style={{ fontSize: '20px' }}
        >{study?.category}</h2>
      </div>

      {/* study container */}
      <div className='flex flex-col gap-1 w-56'>
        <div className='w-56 truncate text-dark-cool font-semibold text-sm'
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
          title={study?.description}
        >
          {study?.description}
        </div>
        <div className='w-56 truncate font-normal text-xs text-dark-cool'
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
        <div className='text-dark-cool text-sm '
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {moment(study.authoredDate).format('DD/MM/YYYY')}
        </div>
        <div className='text-gray-500'
          style={{
            lineHeight: '16px',
            letterSpacing: '0.1px'
          }}
        >
          {countDays(study.authoredDate)}
        </div>
      </div>
      <span style={{ borderBottom: '2px solid #F7F4F4' }}></span>
    </div>
  )
}