import { Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react'
import { useAxiosFetch }  from '../hooks/useAxios';
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, WIDTH_XL } from '../util/constants';
import useWindowDimensions from '../util/useWindowDimensions';
import ArrowBackIOS from './icons/ArrowBack-ios';
import CardList from './medical-history/CardList';
import CardListWarning from './medical-history/CardListWarning';
import TableGynecology from './medical-history/TableGynecology';
import { MedicalHistoryType, Allergy, Cardiopathy, Respiratory, Digestive, Procedure, Others, Gynecology } from './medical-history/Types';
import { ReactComponent as SpinnerLoading } from '../assets/spinner-loading.svg'
//import { mergeJSON } from '../util/helpers';

const urls = {
  getHistory: '/profile/doctor/history',
  allergies: '/profile/doctor/allergyIntolerance'
}

export type ActionType =
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
  | { type: 'gynecology', value: Gynecology }

const initialState: MedicalHistoryType = {
  "personal": {
    "allergies": [],
    "cardiopathies": [],
    "respiratory": [],
    "digestive": [],
    "procedures": [],
    "others": [],
    "gynecology": {
      "gestations_number": 0,
      "births_number": 0,
      "cesarean_number": 0,
      "abortions_number": 0,
      "menarche_age": 0,
      "last_menstruation": 0
    }
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
  patient: iHub.Patient,
}

const MedicalHistory: React.FC<Props> = ({ show = false, setShow, patient, ...props }) => {

  const { width: screenWidth } = useWindowDimensions()
  const {data, loading, error } = useAxiosFetch<MedicalHistoryType>(urls.getHistory, { patient_id: patient.id })

  const [dataHistory, setDataHistory] = useState<MedicalHistoryType>(initialState)

  //const [storeHistory, dispatch] = useReducer(historyReducer, initialState)

  useEffect(() => {
    if (data) setDataHistory(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
                  onClick={() => { }}
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
      <div className='flex flex-col justify-center items-center overflow-y-auto scrollbar relative' style={{ minWidth: '450px' }}>
        <div className='flex flex-col w-full gap-5'
          style={{
            height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`}`
          }}>
          {/* Header */}
          <div className='flex flex-col sticky top-0 z-10 bg-white'>
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
            <div className='flex justify-start mb-1 pl-6'>
              <div className='text-black font-bold text-2xl'>
                Antecedentes clínicos
                <div className='text-cool-gray-400 font-normal text-xl'>
                  personales y familiares
                </div>
              </div>
            </div>
          </div>
          {/* Personal */}
          <div className='flex flex-col items-center w-full gap-3'>
            <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
              <span className='font-medium text-cool-gray-700 tracking-wide'>Personal</span>
            </div>

            <div className='flex flex-col w-full pl-6 pr-2'>
              <CardListWarning
                title='Alergias y sensibilidades'
                dataList={dataHistory?.personal?.allergies ?? []}
                url={urls.allergies}
                patientId={patient.id}
              //callBackAdd={(value) => dispatch({ type: 'allergies_add', value: value })}
              //callBackDel={(id) => dispatch({ type: 'allergies_del', id: id })}
              />
            </div>
            {/* Section pathology */}
            <div className='flex flex-col w-full pl-8 pr-6'>
              <div className='font-medium text-base w-full text-primary-500'>Patologías</div>
              <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
                <CardList
                  title={'Cardiopatías'}
                  dataList={dataHistory?.personal?.cardiopathies ?? []}
                  typeCode='cardiopathies'
                //dispatch={dispatch}
                />
                <CardList
                  title={'Respiratorias'}
                  dataList={dataHistory?.personal?.respiratory ?? []}
                  typeCode='respiratory'
                //dispatch={dispatch}
                />
                <CardList
                  title={'Digestivas'}
                  dataList={dataHistory?.personal?.digestive ?? []}
                  typeCode='digestive'
                //dispatch={dispatch}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col w-full gap-7 mb-5 pl-3 pr-3'>
            {/* Section procedures */}
            <CardList
              TitleElement={() => <div className='font-medium text-base text-primary-500'>Procedimientos</div>}
              dataList={dataHistory?.personal?.procedures ?? []}
              inputTypeWith="date"
              typeCode='procedures'
            //dispatch={dispatch}
            />

            {/* Section Others */}
            <CardList
              TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
              dataList={dataHistory?.personal?.others ?? []}
              inputTypeWith="date"
              typeCode='others_personal'
            //dispatch={dispatch}
            />
            {/* Section Gynecology */}
            <TableGynecology
              gynecology={dataHistory?.personal?.gynecology ?? {}}
              typeCode='gynecology'
            //dispatch={dispatch} 
            />
          </div>
          {/* Family Section */}
          <div className='flex flex-col items-center w-full gap-3 pb-5'>
            <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
              <span className='font-medium text-cool-gray-700 tracking-wide'>Familiar</span>
            </div>
            <div className='flex flex-col w-full pl-2 pr-1 gap-1 mt-5'>
              <CardList
                TitleElement={() => <div className='font-medium text-base text-primary-500'>Enfermedades hereditarias</div>}
                dataList={dataHistory?.family?.hereditary_diseases ?? []}
                inputTypeWith='relationship'
                typeCode='hereditary_diseases'
              //dispatch={dispatch}
              />
              <CardList
                TitleElement={() =>
                  <div className='font-medium text-base text-primary-500'>Otros</div>
                }
                dataList={dataHistory?.family?.others ?? []}
                inputTypeWith="relationship"
                typeCode='others_family'
              //dispatch={dispatch}
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default MedicalHistory