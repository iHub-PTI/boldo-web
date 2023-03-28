import React, { MutableRefObject, useEffect, useState } from 'react';
import CardListWarning from './medical-history/CardListWarning';
import CardList from './medical-history/CardList';
import TableGynecology from './medical-history/TableGynecology';
import PersonOutline from './icons/PersonOutline';
import FamilyIcon from './icons/FamilyIcon';
import CloseButton from './icons/CloseButton';
import { stylePanelSidebar } from './SidebarMenuCall';
import { urls } from "./MedicalHistory";
import { MedicalHistoryType } from './medical-history/Types';
import { useAxiosFetch } from '../hooks/useAxios';
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
import ProgressIcon from './icons/ProgressIcon';
import CloudIcon from './icons/CloudIcon';

export const initialState: MedicalHistoryType = {
  "personal": {
    "allergies": [],
    "pathologies": [],
    "procedures": [],
    "others": [],
    "gynecology": []
  },
  "family": {
    "hereditary_diseases": [],
    "others": []
  }
}


type Props = {
  containerRef: MutableRefObject<HTMLDivElement>,
  appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization },
  medicalHistoryButton: boolean,
  setMedicalHistoryButton: (value: boolean) => void
  handleSidebarHoverOff: () => void,
}

/**
 * Medical History Component Call
 */
export const MedicalHistoryCall: React.FC<Props> = ({
  containerRef,
  appointment,
  medicalHistoryButton,
  setMedicalHistoryButton,
  handleSidebarHoverOff
}) => {

  const patientId = appointment.patient.id
  const { gender } = appointment.patient
  const organizationId = appointment.organization.id

  const { data, loading, error, reload } = useAxiosFetch<MedicalHistoryType>(urls.getHistory, { patient_id: patientId }, medicalHistoryButton)
  const [saveLoading, setSaveLoading] = useState(null)
  const [dataHistory, setDataHistory] = useState<MedicalHistoryType>(initialState)

  useEffect(() => {
    if (data) setDataHistory(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // to control panel hover
  useEffect(() => {



    function handleOutsideClick(event: MouseEvent) {
      /**
     * There is a conflict when removing element by the modal with the container of the panel. With * this we avoid that when deleting and clicking on the modal everything closes.
     */
      let modalDeleteConfirmation = document.getElementById('delete_confirmation_modal')

      if (modalDeleteConfirmation?.contains(event.target as Node)) {
        setMedicalHistoryButton(true)
      } else if (!containerRef.current?.contains(event.target as Node)) {
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
    reload()
    setSaveLoading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalHistoryButton])

  const handlerSaveLoading = (loading) => {
    setSaveLoading(loading)
  }

  if (loading) return (
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
      <div className='flex flex-col flex-1 items-center justify-center' style={stylePanelSidebar}>
        <SpinnerLoading />
      </div>
    </div>
  )

  if (error) return (
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
      <div className='flex flex-col flex-1 items-center justify-center' style={stylePanelSidebar}>
        <div className='mt-6 text-center sm:mt-5'>
          <h3 className='text-base font-medium leading-6 text-white px-4' id='modal-headline'>
            Ha ocurrido un error al traer los antecedentes clínicos personales y familiares
          </h3>
        </div>
        <div className='flex justify-center items-center w-full mt-6 sm:mt-8'>
          <button
            className='px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2'
            onClick={() => reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  )


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
      {saveLoading ?
        <div className='flex flex-col items-center justify-center py-2' style={stylePanelSidebar}>
          <div className='flex flex-row gap-1 items-center bg-transparent'>
            <h5
              className='font-medium text-sm text-white font-sans'
            >Guardando Antecendentes</h5>
            <ProgressIcon className="animate-spin" />
          </div>
        </div> : saveLoading !== null ?
          <div className='flex flex-col items-center justify-center py-2' style={stylePanelSidebar}>
            <div className='flex flex-row gap-1 bg-transparent'>
              <h5
                className='font-medium text-sm text-white font-sans items-center'
              >Antecedentes clínicos guardado correctamente</h5>
              <CloudIcon />
            </div>
          </div> :
          null}
      <div className={`flex flex-col flex-1 py-2 pr-2 items-center gap-4 scrollbar overflow-y-auto relative`} style={stylePanelSidebar}>
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
            dataList={dataHistory?.personal?.allergies ?? []}
            url={urls.allergies}
            patientId={patientId}
            handlerSaveLoading={handlerSaveLoading}
          />
        </div>
        {/* Section pathology */}
        <div className='flex flex-col w-full pl-8 pr-6'>
          <div className='font-medium text-base w-full' style={{ color: "#DB7D68" }}>Patologías</div>
          <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
            <CardList
              title={'Cardiopatías'}
              dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "CDP") ?? []}
              typeCode='cardiopathies'
              categoryCode='CDP'
              url={urls.condition}
              patientId={patientId}
              organizationId={organizationId}
              handlerSaveLoading={handlerSaveLoading}
              darkMode={true}
            />
            <CardList
              title={'Respiratorias'}
              dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "RPT") ?? []}
              typeCode='respiratory'
              categoryCode='RPT'
              url={urls.condition}
              patientId={patientId}
              organizationId={organizationId}
              handlerSaveLoading={handlerSaveLoading}
              darkMode={true}
            />
            <CardList
              title={'Digestivas'}
              dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "DGT") ?? []}
              typeCode='digestive'
              categoryCode='DGT'
              url={urls.condition}
              patientId={patientId}
              organizationId={organizationId}
              handlerSaveLoading={handlerSaveLoading}
              darkMode={true}
            />
          </div>
        </div>
        <div className='flex flex-col w-full gap-7 mb-5 pl-3 pr-3'>
          {/* Section procedures */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-orange-dark'>Procedimientos</div>}
            dataList={dataHistory?.personal?.procedures ?? []}
            inputTypeWith="date"
            typeCode='procedures'
            url={urls.procedures}
            patientId={patientId}
            organizationId={organizationId}
            handlerSaveLoading={handlerSaveLoading}
            darkMode={true}
          />
          {/* Section Others */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
            dataList={dataHistory?.personal?.others}
            inputTypeWith="date"
            categoryCode='OTH'
            url={urls.condition}
            patientId={patientId}
            organizationId={organizationId}
            handlerSaveLoading={handlerSaveLoading}
            darkMode={true}
          />
          {/* Section Gynecology */}
          {gender === 'female' && <TableGynecology
            gynecologies={dataHistory?.personal?.gynecology ?? []}
            url={urls.gynecology}
            patientId={patientId}
            organizationId={organizationId}
            handlerSaveLoading={handlerSaveLoading}
            darkMode={true}
          />}
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
              dataList={dataHistory?.family?.hereditary_diseases ?? []}
              inputTypeWith='relationship'
              typeCode='hereditary_diseases'
              url={urls.familyHistory}
              patientId={patientId}
              organizationId={organizationId}
              handlerSaveLoading={handlerSaveLoading}
              darkMode={true}
            />
            <CardList
              TitleElement={() =>
                <div className='font-medium text-base text-primary-500'>Otros</div>
              }
              dataList={dataHistory?.family?.others}
              inputTypeWith="relationship"
              typeCode='OTH'
              url={urls.familyHistory}
              patientId={patientId}
              organizationId={organizationId}
              handlerSaveLoading={handlerSaveLoading}
              darkMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}