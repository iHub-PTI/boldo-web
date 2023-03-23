import React, { MutableRefObject, useEffect } from 'react';
import CardListWarning from './medical-history/CardListWarning';
import CardList from './medical-history/CardList';
import TableGynecology from './medical-history/TableGynecology';
import PersonOutline from './icons/PersonOutline';
import FamilyIcon from './icons/FamilyIcon';
import { AppointmentWithPatient } from './RecordsOutPatient';
import CloseButton from './icons/CloseButton';
import { stylePanelSidebar } from './SidebarMenuCall';

type MedicalHistoryCallType = {
  containerRef: MutableRefObject<HTMLDivElement>,
  appointment: AppointmentWithPatient;
  medicalHistoryButton: boolean,
  setMedicalHistoryButton: (value: boolean) => void
  handleSidebarHoverOff: () => void,
}

/**
 * Medical History Component Call
 */
export const MedicalHistoryCall: React.FC<MedicalHistoryCallType> = ({
  containerRef,
  appointment: AppointmentWithPatient,
  medicalHistoryButton,
  setMedicalHistoryButton,
  handleSidebarHoverOff
}) => {

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        if (!medicalHistoryButton) return
        setMedicalHistoryButton(false)
      }
    }
    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalHistoryButton])

  useEffect(() => {
    if (medicalHistoryButton) return
    handleSidebarHoverOff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalHistoryButton])

  return (
    <div
      className={`opacity-0 ${medicalHistoryButton && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
      style={{ width: medicalHistoryButton ? '26rem' : '0px' }}
    >
      <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center justify-between'>
        <span className='text-white font-medium text-sm truncate'>Antecedentes Clínicos</span>
        <button className='focus:outline-none' onClick={() => {
          setMedicalHistoryButton(false)

        }}>
          <CloseButton />
        </button>
      </div>
      <div className={`flex flex-col flex-1 py-2 pr-2 items-center gap-4 scrollbar overflow-y-auto`} style={stylePanelSidebar}>
        {/* Personal */}
        <div className='flex flex-row flew-no-wrap w-full'>
          <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#FFFFFF' }}>
            <span className='flex flex-row font-medium text-cool-gray-700 tracking-wide gap-2'>
              <PersonOutline fill={"#364152"} />
              Personal
            </span>
          </div>
        </div>
        <div className='flex flex-col w-full pl-6 pr-2'>
          <CardListWarning
            title='Alergias y sensibilidades'
            dataList={[]}
            url={''}
            patientId={''}
            handlerSaveLoading={(value: boolean) => { }}
          />
        </div>
        {/* Section pathology */}
        <div className='flex flex-col w-full pl-8 pr-6'>
          <div className='font-medium text-base w-full' style={{ color: "#DB7D68" }}>Patologías</div>
          <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
            <CardList
              title={'Cardiopatías'}
              dataList={[]}
              typeCode='cardiopathies'
              darkMode={true}
            />
            <CardList
              title={'Respiratorias'}
              dataList={[]}
              typeCode='respiratory'
              darkMode={true}
            />
            <CardList
              title={'Digestivas'}
              dataList={[]}
              typeCode='digestive'
              darkMode={true}
            />
          </div>
        </div>
        <div className='flex flex-col w-full gap-7 mb-5 pl-3 pr-3'>
          {/* Section procedures */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-orange-dark'>Procedimientos</div>}
            dataList={[]}
            inputTypeWith="date"
            typeCode='procedures'
            darkMode={true}
          />
          {/* Section Others */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-orange-dark'>Otros</div>}
            dataList={[]}
            inputTypeWith="date"
            typeCode='others_personal'
            darkMode={true}
          />
          {/* Section Gynecology */}
          <TableGynecology
            gynecology={[]}
            typeCode='gynecology'
            darkMode={true}
          />
        </div>
        {/* Familiar */}
        <div className='flex flex-col items-center w-full gap-3 pb-5'>
          <div className='flex flex-row flew-no-wrap w-full'>
            <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#FFFFFF' }}>
              <span className='flex flex-row gap-2 font-medium text-cool-gray-700 tracking-wide'>
                <FamilyIcon fill={"#364152"} />
                Familiar
              </span>
            </div>
          </div>
          <div className='flex flex-col w-full pl-2 pr-1 gap-1 mt-5'>
            <CardList
              TitleElement={() => <div className='font-medium text-base text-orange-dark'>Enfermedades hereditarias</div>}
              dataList={[]}
              inputTypeWith='relationship'
              typeCode='hereditary_diseases'
              darkMode={true}
            />
            <CardList
              TitleElement={() =>
                <div className='font-medium text-base text-orange-dark'>Otros</div>
              }
              dataList={[]}
              inputTypeWith="relationship"
              typeCode='others_family'
              darkMode={true}
            />
          </div>
        </div>
      </div>

    </div>
  )
}