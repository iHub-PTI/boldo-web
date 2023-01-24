import React, { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { toUpperLowerCase } from '../util/helpers';
import ArrowDown from './icons/ArrowDown';
import differenceInYears from 'date-fns/differenceInYears';
import UserCircle from './icons/patient-register/UserCircle';
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

type Props = {
  children: React.ReactNode;
  appointment: AppointmentWithPatient;
}

const RecordOutPatientCall: React.FC<Props> = ({ children, appointment }) => {
  console.log(appointment)

  const [recordOutPatientButton, setRecordOutPatientButton] = useState(false)

  const onClickOutPatientRecord = () => {
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  return (
    <div className='flex flex-no-wrap relative h-full'>
      <div className='flex flex-col absolute group hover:cursor-pointer w-24 hover:w-60 inset-0 z-50 bg-gray-100 transition-all duration-500'>
        <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
          <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
            className='border-1 border-white rounded-full w-15 h-15' />
        </div>
        <Disclosure>
          {({ open }) => (
            <div className='w-0 group-hover:w-auto group-hover:opacity-100 opacity-0 flex flex-col justify-center bg-white rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate'>
              <Disclosure.Button className="focus:outline-none ">
                <div className='flex flex-row flex-no-wrap justify-center text-xl text-cool-gray-700 font-semibold truncate'>
                  <span className='truncate'> {toUpperLowerCase(appointment.patient.givenName.split(' ')[0] + ' ' + appointment.patient.familyName.split(' ')[0])}</span>
                  <ArrowDown className={`${open ? 'rotate-180 transform' : ''}`} />
                </div>
                <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>{appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                  ? 'Paciente sin cédula'
                  : 'CI ' + appointment.patient.identifier}</span>
              </Disclosure.Button>
              <Disclosure.Panel className="focus:outline-none ">
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Edad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(appointment.patient.birthDate))}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Profesion</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.job}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Teléfono</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.phone}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Ciudad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.city}</span>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <div className='flex flex-row flex-no-wrap justify-center items-center '>
          <button className={`flex flex-row flex-no-wrap gap-2 justify-center items-center p-2 focus:outline-none`} onClick={() => onClickOutPatientRecord()}>
            <UserCircle fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
            <div className={`w-0 group-hover:w-auto group-hover:opacity-100 opacity-0 flex text-base font-medium text-gray-500 truncate transition-opacity duration-500 ${recordOutPatientButton && 'text-primary-600 font-semibold'}`}>Registro Ambulatorio</div>
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

export default RecordOutPatientCall