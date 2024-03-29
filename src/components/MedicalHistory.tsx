import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import { useAxiosFetch } from '../hooks/useAxios';
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, ORGANIZATION_BAR, WIDTH_XL } from '../util/constants';
import useWindowDimensions from '../util/useWindowDimensions';
import ArrowBackIOS from './icons/ArrowBack-ios';
import CardList from './medical-history/CardList';
import CardListWarning from './medical-history/CardListWarning';
import TableGynecology from './medical-history/TableGynecology';
import { MedicalHistoryType } from './medical-history/Types';
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
import ProgressIcon from './icons/ProgressIcon';
import CloudIcon from './icons/CloudIcon';

//import { mergeJSON } from '../util/helpers';

export const urls = {
  getHistory: '/profile/doctor/history',
  allergies: '/profile/doctor/allergyIntolerance',
  condition: '/profile/doctor/condition',
  procedures: '/profile/doctor/procedure',
  familyHistory: '/profile/doctor/familyMemberHistory',
  gynecology: '/profile/doctor/observation'
}

/* export type ActionType =
  | { type: 'initial', value: Partial<MedicalHistoryType> }
  | { type: 'allergies_add', value: Allergy }
  | { type: 'allergies_del', id: string }
  | { type: 'cardiopathies_add', value: Cardiopathy }
  | { type: 'cardiopathies_del', id: string }
  | { type: 'respiratory_add', value: Respiratory }
  | { type: 'respiratory_del', id: string }
  | { type: 'digestive_add', value: Digestive }
  | { type: 'digestive_del', id: string }
  | { type: 'procedures_add', value: Procedure }
  | { type: 'procedures_del', id: string }
  | { type: 'others_personal_add', value: Others }
  | { type: 'others_personal_del', id: string }
  | { type: 'hereditary_diseases_add', value: Others }
  | { type: 'hereditary_diseases_del', id: string }
  | { type: 'others_family_add', value: Others }
  | { type: 'others_family_del', id: string }
  | { type: 'gynecology', value: Gynecology } */

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

/* const historyReducer = (state: MedicalHistoryType, action: ActionType) => {
  switch (action.type) {
    case 'initial':
      let obj = mergeJSON(initialState, action.value)
      return { ...state, ...obj }

    case 'allergies_add':
      state.personal.allergies.push(action.value)
      return { ...state }

    case 'allergies_del':
      state.personal.allergies = state.personal.allergies.filter(data => data.id !== action.id)
      return { ...state }

    case 'cardiopathies_add':
      state.personal.cardiopathies.push(action.value)
      return { ...state }

    case 'cardiopathies_del':
      state.personal.cardiopathies =
        state.personal.cardiopathies.filter(data => data.id !== action.id)
      return { ...state }

    case 'respiratory_add':
      state.personal.respiratory.push(action.value)
      return { ...state }

    case 'respiratory_del':
      state.personal.respiratory = state.personal.respiratory.filter(data => data.id !== action.id)
      return { ...state }

    case 'digestive_add':
      state.personal.digestive.push(action.value)
      return { ...state }

    case 'digestive_del':
      state.personal.digestive = state.personal.digestive.filter(data => data.id !== action.id)
      return { ...state }

    case 'procedures_add':
      state.personal.procedures.push(action.value)
      return { ...state }

    case 'procedures_del':
      state.personal.procedures = state.personal.procedures.filter(data => data.id !== action.id)
      return { ...state }

    case 'others_personal_add':
      state.personal.others.push(action.value)
      return { ...state }

    case 'others_personal_del':
      state.personal.others = state.personal.others.filter(data => data.id !== action.id)
      return { ...state }

    case 'hereditary_diseases_add':
      state.family.hereditary_diseases.push(action.value)
      return { ...state }

    case 'hereditary_diseases_del':
      state.family.hereditary_diseases =
        state.family.hereditary_diseases.filter(data => data.id !== action.id)
      return { ...state }

    case 'others_family_add':
      state.family.others.push(action.value)
      return { ...state }

    case 'others_family_del':
      state.family.others = state.family.others.filter(data => data.id !== action.id)
      return { ...state }

    case 'gynecology':
      state.personal.gynecology = action.value
      return { ...state }

    default:
      return state
  }
} */

type Props = {
  show: boolean,
  setShow: (value: boolean) => void
  appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization },
}

const MedicalHistory: React.FC<Props> = ({ show = false, setShow, appointment, ...props }) => {

  const { width: screenWidth } = useWindowDimensions()

  const patientId = appointment.patient.id
  const { gender } = appointment.patient
  //rectrict medical history
  const isEditable = appointment.status === 'closed' || appointment.status === 'open'
  //console.log(isEditable, appointment.status)
  const organizationId = appointment.organization.id
  const appointmentId = appointment.id

  const { data, loading, error, reload } = useAxiosFetch<MedicalHistoryType>(urls.getHistory, { patient_id: patientId }, show)
  const [saveLoading, setSaveLoading] = useState(null)
  const [dataHistory, setDataHistory] = useState<MedicalHistoryType>(initialState)


  const handlerSaveLoading = (loading) => {
    setSaveLoading(loading)
  }

  useEffect(() => {
    if (data) setDataHistory(data)
    //console.log(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!show) handlerSaveLoading(null)
  }, [show])

  if (loading) return (
    <Transition
      show={show}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-col justify-center items-center overflow-y-auto scrollbar relative' style={{ minWidth: '450px' }}>
        <div className='flex flex-col w-full gap-5'
          style={{
            height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`}`
          }}>
          {/* Header */}
          <div className='flex flex-col h-full sticky top-0 z-10 bg-white'>
            <div className='flex flex-row pl-5'>
              <button
                className='flex flex-row items-center h-11 max-w-max-content focus:outline-none'
                onClick={() => {
                  setShow(false)
                }}
              >
                <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
              </button>
            </div>
            <div className='flex justify-start h-12 mb-1 pl-6'>
              <div className='text-black font-bold text-2xl'>
                Antecedentes clínicos
                <div className='text-cool-gray-400 font-normal text-xl'>
                  personales y familiares
                </div>
              </div>
            </div>
            <div className='flex flex-col h-full items-center justify-center' style={{ width: '350px' }}>
              <SpinnerLoading />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )

  if (error) return (
    <Transition
      show={show}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-col justify-center items-center overflow-y-auto scrollbar relative' style={{ minWidth: '450px' }}>
        <div className='flex flex-col w-full gap-5'
          style={{
            height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`}`
          }}>
          {/* Header */}
          <div className='flex flex-col h-full sticky top-0 z-10 bg-white'>
            <div className='flex flex-row pl-5'>
              <button
                className='flex flex-row items-center h-11 max-w-max-content focus:outline-none'
                onClick={() => {
                  setShow(false)
                }}
              >
                <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
              </button>
            </div>
            <div className='flex justify-start h-12 mb-1 pl-6'>
              <div className='text-black font-bold text-2xl'>
                Antecedentes clínicos
                <div className='text-cool-gray-400 font-normal text-xl'>
                  personales y familiares
                </div>
              </div>
            </div>
            <div className='flex flex-col h-full items-center justify-center' style={{ width: '400px' }}>
              <div className='mt-6 text-center sm:mt-5'>
                <h3 className='text-base font-medium leading-6 text-gray-900 px-4' id='modal-headline'>
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
        </div>
      </div>
    </Transition>
  )

  return (
    <Transition
      show={show}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className='flex flex-col justify-center items-center relative' style={{ minWidth: '450px' }}>
        {/* Header */}
        <div className='flex flex-col w-full bg-white' style={{ height: '148px' }}>
          <div className='flex flex-row pl-5'>
            <button
              className='flex flex-row items-center h-11 max-w-max-content focus:outline-none'
              onClick={() => {
                setShow(false)
              }}
            >
              <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
            </button>
          </div>
          {/* Componente desde aca */}
          <div className='flex flex-col justify-start mb-1 pl-6 gap-2'>
            <div className='text-black font-bold text-2xl'>
              Antecedentes clínicos
              <div className='text-cool-gray-400 font-normal text-xl'>
                personales y familiares
              </div>
            </div>
            {saveLoading ?
              <div className='flex flex-row gap-1 items-center'>
                <h5
                  className='font-medium text-sm text-gray-500 font-sans'
                >Guardando Antecendentes</h5>
                <ProgressIcon className="animate-spin" />
              </div> : saveLoading !== null ?
                <div className='flex flex-row gap-1'>
                  <h5
                    className='font-medium text-sm text-gray-500 font-sans items-center'
                  >Antecedentes clínicos guardado correctamente</h5>
                  <CloudIcon />
                </div> :
                null}

          </div>
        </div>
        <div className='overflow-y-auto scrollbar w-full'>
          <div className='flex flex-col w-full gap-2'
            style={{
              height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + 148}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR + ORGANIZATION_BAR + 148}px)`}`
            }}>
            {/* Personal */}
            <div className='flex flex-col items-center w-full gap-3'>
              <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
                <span className='font-bold text-cool-gray-700 tracking-wide text-lg'>Personal</span>
              </div>

              <div className='flex flex-col w-full pl-6 pr-2'>
                <CardListWarning
                  title='Alergias y sensibilidades'
                  dataList={dataHistory?.personal?.allergies ?? []}
                  url={urls.allergies}
                  patientId={patientId}
                  organizationId={organizationId}
                  appointmentId={appointmentId}
                  handlerSaveLoading={handlerSaveLoading}
                  isEditable={isEditable}
                />
              </div>
              {/* Section pathology */}
              <div className='flex flex-col w-full pl-8 pr-6'>
                <div className='font-medium text-base w-full text-primary-500'>Patologías</div>
                <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
                  <CardList
                    title={'Cardiopatías'}
                    dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "CDP") ?? []}
                    categoryCode='CDP'
                    url={urls.condition}
                    patientId={patientId}
                    organizationId={organizationId}
                    appointmentId={appointmentId}
                    handlerSaveLoading={handlerSaveLoading}
                    isEditable={isEditable}
                  />
                  <CardList
                    title={'Respiratorias'}
                    dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "RPT") ?? []}
                    categoryCode='RPT'
                    url={urls.condition}
                    patientId={patientId}
                    organizationId={organizationId}
                    appointmentId={appointmentId}
                    handlerSaveLoading={handlerSaveLoading}
                    isEditable={isEditable}
                  />
                  <CardList
                    title={'Digestivas'}
                    dataList={dataHistory?.personal?.pathologies?.filter(value => value.category === "DGT") ?? []}
                    categoryCode='DGT'
                    url={urls.condition}
                    patientId={patientId}
                    organizationId={organizationId}
                    appointmentId={appointmentId}
                    handlerSaveLoading={handlerSaveLoading}
                    isEditable={isEditable}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-col w-full gap-7 mb-5 pl-3 pr-3'>
              {/* Section procedures */}
              <CardList
                TitleElement={() =>
                  <div>
                    <div className='font-medium text-base text-primary-500'>Procedimientos</div>
                    {isEditable && <span className='text-color-disabled text-xs'>Ej: Apendicectomía, Colonoscopia, etc.</span>}
                  </div>
                }
                dataList={dataHistory?.personal?.procedures ?? []}
                inputTypeWith="date"
                url={urls.procedures}
                patientId={patientId}
                organizationId={organizationId}
                appointmentId={appointmentId}
                handlerSaveLoading={handlerSaveLoading}
                isEditable={isEditable}
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
                appointmentId={appointmentId}
                handlerSaveLoading={handlerSaveLoading}
                isEditable={isEditable}
              />
              {/* Section Gynecology */}
              {gender === 'female' &&
                <TableGynecology
                  gynecologies={dataHistory?.personal?.gynecology ?? []}
                  url={urls.gynecology}
                  patientId={patientId}
                  organizationId={organizationId}
                  appointmentId={appointmentId}
                  handlerSaveLoading={handlerSaveLoading}
                  isEditable={isEditable}
                />
              }
            </div>
            {/* Family Section */}
            <div className='flex flex-col items-center w-full gap-3 pb-5'>
              <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
                <span className='font-bold text-cool-gray-700 tracking-wide text-lg'>Familiar</span>
              </div>
              <div className='flex flex-col w-full pl-2 pr-1 gap-1 mt-5'>
                <CardList
                  TitleElement={() => <div className='font-medium text-base text-primary-500'>Enfermedades hereditarias</div>}
                  dataList={dataHistory?.family?.hereditary_diseases ?? []}
                  inputTypeWith='relationship'
                  typeCode='HDS'
                  url={urls.familyHistory}
                  patientId={patientId}
                  organizationId={organizationId}
                  handlerSaveLoading={handlerSaveLoading}
                  isEditable={isEditable}
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
                  isEditable={isEditable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default MedicalHistory
