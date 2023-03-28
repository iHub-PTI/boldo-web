import React, { useState, useEffect, useRef } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { toUpperLowerCase } from '../util/helpers';
import ArrowDown from './icons/ArrowDown';
import differenceInYears from 'date-fns/differenceInYears';
import UserCircle from './icons/patient-register/UserCircle';
import NoProfilePicture from './icons/NoProfilePicture';
import HistoryIcon from './icons/HistoryIcon';
import { MedicalHistoryCall } from './MedicalHistoryCall';
import { RecordOutPatientCall } from './RecordOutPatientCall';


export const stylePanelSidebar = {
  background: 'rgba(107, 107, 107, 0.56)',
  backdropFilter: 'blur(13.5px)'
}

type PropsSidebarMenuCall = {
  children: React.ReactNode;
  appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization };
}

const SidebarMenuCall: React.FC<PropsSidebarMenuCall> = ({ children, appointment }) => {

  const [recordOutPatientButton, setRecordOutPatientButton] = useState(false)
  const [medicalHistoryButton, setMedicalHistoryButton] = useState(false)
  // this control the dropdown animations
  const [transition, setTransition] = useState<boolean>(false)
  const [hoverSidebar, setHoverSidebar] = useState(false)


  // this function control the transition value
  const handleTransition = () => {
    setTransition(!transition)
  }

  const handleSidebarHoverOn = () => {
    setHoverSidebar(true)
  }

  const handleSidebarHoverOff = () => {
    if (recordOutPatientButton) return
    if (medicalHistoryButton) return
    setHoverSidebar(false)
  }

  const onClickOutPatientRecord = () => {
    setMedicalHistoryButton(false)
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  const medicalHistoryToggleButton = () => {
    setRecordOutPatientButton(false)
    setMedicalHistoryButton(!medicalHistoryButton)
  }

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!recordOutPatientButton) return
        setRecordOutPatientButton(false)
      }
    }
    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordOutPatientButton])

  return (
    <div className='flex flex-no-wrap relative h-full'>
      <div className='p-0 m-0 flex flex-no-wrap h-full' ref={container}>
        <div className={`flex flex-col absolute group ${hoverSidebar && 'cursor-pointer w-60'} w-24 inset-0 z-50 bg-gray-100 transition-all duration-500`}
          onMouseOver={() => handleSidebarHoverOn()}
          onMouseLeave={() => handleSidebarHoverOff()}
        >
          <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
            {appointment.patient.photoUrl ? <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
              className={`border-1 border-white rounded-full w-15 h-15 object-cover transform origin-top duration-500 ${transition ?'scale-150':'100'}`} /> :
              <NoProfilePicture className={`bg-gray-200 rounded-full border-gray-200 border-1 w-15 h-15 transform origin-top duration-500 ${transition ?'scale-150':'100'}`} />
            }
          </div>
          <Disclosure>
            {({ open }) => (
              <div className={`w-0 ${hoverSidebar && 'w-auto opacity-100'} opacity-0 flex flex-col justify-start rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate scrollbar transform duration-500 ${transition ?'translate-y-12':''}`} style={{ height: open ? '310px' : '', overflowY: 'auto' }}>
                <Disclosure.Button className="focus:outline-none" style={{ height: '54px' }} onClick={handleTransition} >
                  <div className='flex flex-row flex-no-wrap justify-center items-center text-xl text-cool-gray-700 font-semibold truncate'>
                    <span className='truncate'> {toUpperLowerCase(appointment.patient.givenName.split(' ')[0] + ' ' + appointment.patient.familyName.split(' ')[0])}{appointment.patient.birthDate && ', '} {differenceInYears(Date.now(), new Date(appointment.patient.birthDate)) || ''}</span>
                    <ArrowDown className={`${open ? 'rotate-180 transform' : ''}`} />
                  </div>
                  <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>{appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                    ? 'Paciente sin cédula'
                    : 'CI ' + appointment.patient.identifier}</span>
                </Disclosure.Button>
                <Transition
                  enter="transition-all duration-500 transform origin-top ease-linear"
                  enterFrom="opacity-0 scale-y-0"
                  enterTo="opacity-100 scale-y-100"
                  leave="transition-all duration-500 transform origin-top ease-linear"
                  leaveFrom="opacity-100 scale-y-100"
                  leaveTo="opacity-0 scale-y-0"
                >
                  <Disclosure.Panel className="focus:outline-none ">
                    <div className='flex flex-col'>
                      <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Edad</span>
                      <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(appointment.patient.birthDate)) || '-'}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Profesion</span>
                      <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.job || '-'}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Teléfono</span>
                      <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.phone || '-'}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Ciudad</span>
                      <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.city || '-'}</span>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
          <div className={`flex flex-col flex-no-wrap justify-center items-center transform ease-linear duration-500 ${transition ?'translate-y-12':''}`}>
            <button className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`} onClick={() => onClickOutPatientRecord()}>
              <UserCircle className='w-5 h-5' fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
              <div className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${recordOutPatientButton && 'text-primary-600 font-semibold'}`} style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}>Registro Ambulatorio</div>
            </button>
            <button className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`} onClick={() => medicalHistoryToggleButton()}>
              <HistoryIcon fill={`${medicalHistoryButton ? '#13A5A9' : '#6B7280'}`} />
              <div className={`ml-1 w-0 ${hoverSidebar && 'w-11/12 opacity-100'} opacity-0 flex text-base font-medium text-gray-500 truncate ${medicalHistoryButton && 'text-primary-600 font-semibold'}`} style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}>Antecedentes Clínicos</div>
            </button>
          </div>
        </div>

        <RecordOutPatientCall
          containerRef={container}
          appointment={appointment}
          recordOutPatientButton={recordOutPatientButton}
          setRecordOutPatientButton={setRecordOutPatientButton}
          handleSidebarHoverOff={handleSidebarHoverOff}
        />

        <MedicalHistoryCall
          containerRef={container}
          appointment={appointment}
          medicalHistoryButton={medicalHistoryButton}
          setMedicalHistoryButton={setMedicalHistoryButton}
          handleSidebarHoverOff={handleSidebarHoverOff}
        />

      </div>
      {children}
    </div>
  )
}

export default SidebarMenuCall
