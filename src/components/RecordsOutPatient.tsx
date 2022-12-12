import React from 'react'
import ArrowBackIOS from '../components/icons/ArrowBack-ios'
import SearchIcon from './icons/SearchIcon'
import CheckIcon from './icons/CheckIcon'
import UrgentIcon from './icons/UrgentIcon'
import { Disclosure } from '@headlessui/react'
import ArrowDown from './icons/ArrowDown'
import NoProfilePicture from './icons/NoProfilePicture'

type Props = {
  show: boolean
  setShow: (value: any) => void
  consultations?: any[]
}

export const RecordsOutPatient: React.FC<Props> = ({ show = false, setShow = () => {} }) => {
  return (
    <div className='flex flex-col px-5 pt-5 w-full h-full'>
      {/* Head */}
      <div className='flex flex-row items-center mb-2 h-11'>
        <ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
      </div>

      {/* title outpatientRecord */}
      <div className='flex justify-start h-auto mb-1'>
        <div className='text-black font-bold text-2xl'>
          Registro de consultas ambulatorias
          <div className='text-cool-gray-400 font-normal text-xl'>
            Anotaciones, recetas y ordenes de estudios anteriores
          </div>
        </div>
      </div>

      {/* input search */}
      <div className='w-64 h-auto relative bg-cool-gray-50 rounded-lg mb-5 mt-5'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <SearchIcon className='w-5 h-5' />
        </div>
        <input
          className='p-3 pl-10 w-full outline-none hover:bg-cool-gray-100 transition-colors delay-200 rounded-lg'
          type='search'
          name='search'
          placeholder='Nombre, Especialidad, etc.'
          autoComplete='off'
        />
      </div>

      {/* body */}
      <div className='flex flex-row w-full h-full justify-center gap-3'>
        <div className='flex flex-col min-w-min-content overflow-y-auto overflow-x-hidden mx-1 scrollbar' style={{height: 'calc(100vh - 400px)'}}>
          <OutPatientDetail active={true} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
          <OutPatientDetail active={false} />
        </div>
        <div className='flex flex-col w-full'>
          <DescripcionRecordPatientDetail />
        </div>
      </div>
    </div>
  )
}

type DetailRecordPatientProps = {
  active?: boolean
  doctorName?: string
  specialty?: string
  diagnosis?: string
  querydate?: Date
}

const OutPatientDetail: React.FC<DetailRecordPatientProps> = props => {
  return (
    <div
      className='flex flex-row pl-1 pt-1 w-64 h-28 rounded-lg group cursor-pointer hover:bg-gray-100 mb-1 mx-1'
      style={{ backgroundColor: props.active ? '#EDF2F7' : '' }}
    >
      <div className='flex flex-col w-2/12 mr-2'>
        <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-2 w-10 h-10' />
      </div>
      <div className='flex flex-col w-full'>
        <div className='font-semibold text-base' style={{ color: '#364152' }}>
          Dr. Miriam Sandoval
        </div>
        <div className='text-base mb-1 text-gra text-gray-700' style={{ color: '#364152' }}>
          Neurología
        </div>
        <div className='text-gray-500 font-normal w-44 truncate mb-1 group-hover:text-primary-500'>
          Hipertensión intracraneal ipertensión intracranea ipertensión intracraneaipertensión intracranea
        </div>
        <div className='flex flex-row gap-2'>
          <div className='font-normal' style={{ color: '#364152' }}>
            11/12/2022
          </div>
          <div className='text-gray-500'>Hoy</div>
        </div>
      </div>
    </div>
  )
}

type DescripcionRecordPatientProps = {
  mainReason?: string
  diagnosis?: string
  prescriptions?: any[]
  studies?: any[]
  soep?: any
}

const DescripcionRecordPatientDetail = () => {
  return (
    <div className='flex flex-col w-full h-full gap-5'>
      <div>
        <div className='font-normal text-primary-500'>Motivo Principal de la visita</div>
        <div className='font-semibold'>Dolor de cabeza prolongado</div>
      </div>
      <div>
        <div className='font-normal text-primary-500'>Impresión diagnóstica</div>
        <div className='font-semibold'>Hipertensión intracraneal idiopática</div>
      </div>
      {/* Prescriptions */}
      <div>
        <div className='font-normal text-primary-500'>Prescripciones</div>
        <div className='flex flex-col gap-1 pt-1 justify-center items-start'>
          <div className='flex flex-row bg-gray-100 rounded-md w-9/12'>
            <div className='flex flex-col p-2 w-6/12'>
              <div className='text-black'>Penbiotic retard 1.200.000</div>
              <div className='text-gray-500'>Frasco ampolla + Solvente 5ml</div>
            </div>
            <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>Dosis única</div>
          </div>

          <div className='flex flex-row bg-gray-100 rounded-md w-9/12'>
            <div className='flex flex-col p-2 w-6/12'>
              <div className='text-black'>Penbiotic retard 1.200.000</div>
              <div className='text-gray-500'>Frasco ampolla + Solvente 5ml</div>
            </div>
            <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>Dosis única</div>
          </div>

          <div className='flex flex-row bg-gray-100 rounded-md w-9/12'>
            <div className='flex flex-col p-2 w-6/12'>
              <div className='text-black'>Biogramon caliente con vitamina c</div>
              <div className='text-gray-500'>Granulado soluble, 20 sobres x 3mg</div>
            </div>
            <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>
              1 sobre x 3mg cada 6 horas por 7 días.
              <div className='text-gray-500'>Granulado soluble, 20 sobres x 3mg</div>
            </div>
          </div>
        </div>
      </div>
      {/* Studies */}
      <div>
        <div className='font-normal text-primary-500'>Estudios solicitados</div>
        <div className='flex flex-col gap-1 pt-1 justify-center items-start'>
          <div className='flex flex-row bg-gray-100 rounded-md w-9/12'>
            <div className='flex flex-col justify-center items-center p-2'>
              <CheckIcon active={true} />
            </div>
            <div className='flex flex-col p-2 w-6/12 gap-1'>
              <div className='text-black'>Imagen por resonancia magnética</div>
              <UrgentIcon />
            </div>

            <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>Con gadolino</div>
          </div>

          <div className='flex flex-row bg-gray-100 rounded-md w-9/12'>
            <div className='flex flex-col justify-center items-center p-2'>
              <CheckIcon />
            </div>
            <div className='flex flex-col p-2 w-6/12'>
              <div className='text-black'>Hemograma, Glucosa, Plaquetas, Orina simple</div>
            </div>
            <div className='flex flex-col p-2 m-1 bg-white rounded-md w-6/12'>Tomar muestra en ayunas</div>
          </div>
        </div>
      </div>
      {/* SOEP */}
      <div>
        <div className='font-normal text-primary-500'>Plan</div>
        <p className='w-7/12'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet accusamus vero vel sequi modi! At id ab iste
          porro ut voluptas culpa a eos beatae repellendus debitis, obcaecati nemo? Dignissimos!
        </p>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className='mt-3 p-2 flex flex-row focus:outline-none hover:bg-gray-100 transition-colors delay-200 rounded-md text-primary-500'>
                {open ? 'ocultar' : 'más anotaciones'}{' '}
                <ArrowDown fill='#13A5A9' className={`${open ? 'rotate-180 transform' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className='my-2 w-7/12'>
                <div className='flex flex-col p-2 bg-gray-100 rounded-md gap-2'>
                  <div>
                    <div className='font-semibold'>Subjetivo</div>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident sapiente earum, ducimus,
                      cumque aspernatur, porro mollitia nostrum illum amet tempora tenetur pariatur voluptates atque
                      possimus maiores quia praesentium cum doloremque.
                    </p>
                  </div>
                  <div>
                    <div className='font-semibold'>Objetivo</div>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident sapiente earum, ducimus,
                      cumque aspernatur, porro mollitia nostrum illum amet tempora tenetur pariatur voluptates atque
                      possimus maiores quia praesentium cum doloremque.
                    </p>
                  </div>
                  <div>
                    <div className='font-semibold'>Evaluación</div>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident sapiente earum, ducimus,
                      cumque aspernatur, porro mollitia nostrum illum amet tempora tenetur pariatur voluptates atque
                      possimus maiores quia praesentium cum doloremque.
                    </p>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
