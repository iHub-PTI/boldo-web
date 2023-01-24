import React, { useRef, useState, useEffect } from 'react'
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
  //const sidebarRef = useRef<HTMLDivElement>()
  const [hoverSidebar, setHoverSidebar] = useState(false)

  const onClickOutPatientRecord = () => {
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  const handleSidebarHoverOn = () => {
    setHoverSidebar(true)
  }

  const handleSidebarHoverOff = () => {
    if (recordOutPatientButton) return
    setHoverSidebar(false)
  }

  useEffect(() => {
    console.log(hoverSidebar)
  })

  useEffect(() => {
    if (!recordOutPatientButton) return
    handleSidebarHoverOff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOutPatientButton])

  return (
    <div className='flex flex-no-wrap relative h-full'>
      <div className={`flex flex-col absolute group ${hoverSidebar && 'cursor-pointer w-60'} w-24 inset-0 z-50 bg-gray-100 transition-all duration-500`}
        onMouseOver={() => handleSidebarHoverOn()}
        onMouseLeave={() => handleSidebarHoverOff()}
      >
        <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
          <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
            className='border-1 border-white rounded-full w-15 h-15 object-cover' />
        </div>
        <Disclosure>
          {({ open }) => (
            <div className={`w-0 ${hoverSidebar && 'w-auto opacity-100'} opacity-0 flex flex-col justify-center bg-white rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate`}>
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
          <button className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`} onClick={() => onClickOutPatientRecord()}>
            <UserCircle className='w-5 h-5' fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
            <div className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${recordOutPatientButton && 'text-primary-600 font-semibold'}`} style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}>Registro Ambulatorio</div>
          </button>
        </div>
      </div>
      <div
        className={`opacity-0 ${recordOutPatientButton && 'opacity-100'} flex flex-col z-50 absolute left-60 h-full transition-all duration-300 rounded-r-xl`}
        style={{ width: recordOutPatientButton ? '21.6rem' : '0px' }}
      >
        <div className='flex flex-row flex-no-wrap bg-primary-500 h-10 rounded-tr-xl pl-3 py-2 pr-2 items-center'>
          <span className='text-white font-medium text-sm truncate'>Registro de consultas ambulatorias</span>
        </div>
        <div className={`flex flex-col flex-1 p-2`} style={{backgroundColor:'#6b6b6b', opacity:'56%', backdropFilter: 'blur(13px)'}}>
          <span className='text-white'>hola</span>
        </div>
      </div>
      {children}
    </div>
  )
}

export default RecordOutPatientCall