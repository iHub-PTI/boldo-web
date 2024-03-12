import { Disclosure, Transition } from '@headlessui/react'
import differenceInYears from 'date-fns/differenceInYears'
import React, { useEffect, useRef, useState } from 'react'
import { MdErrorOutline } from 'react-icons/md'
import { useEncounterStore } from '../store/encounterStore'
import { toUpperLowerCase } from '../util/helpers'
import { MedicalHistoryCall } from './MedicalHistoryCall'
import { RecordOutPatientCall } from './RecordOutPatientCall'
import { OrderHistoryCall } from './history-study-order/OrderHistoryCall'
import { StudyHistoryCall } from './history-study-order/StudyHistoryCall'
import ArrowDown from './icons/ArrowDown'
import HistoryIcon from './icons/HistoryIcon'
import NoProfilePicture from './icons/NoProfilePicture'
import StudyHistoryIcon from './icons/StudyHistoryIcon'
import UserCircle from './icons/patient-register/UserCircle'
import ModalReportPatient from './report-patient/ModalReportPatient'

export const stylePanelSidebar = {
  background: 'rgba(107, 107, 107, 0.56)',
  backdropFilter: 'blur(13.5px)',
}

type PropsSidebarMenuCall = {
  children: React.ReactNode
  appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & {
    organization: Boldo.Organization
  }
}

const SidebarMenuCall: React.FC<PropsSidebarMenuCall> = ({ children, appointment }) => {
  const [recordOutPatientButton, setRecordOutPatientButton] = useState(false)
  const [medicalHistoryButton, setMedicalHistoryButton] = useState(false)
  const [studyHistoryButton, setStudyHistoryButton] = useState(false)
  const [orderHistoryButton, setOrderHistoryButton] = useState(false)

  // this control the dropdown animations
  const [transition, setTransition] = useState<boolean>(false)
  const [hoverSidebar, setHoverSidebar] = useState(false)
  const disclosureRef = useRef<HTMLButtonElement>(null)

  //report patient button
  const [isOpenReportPatient, setIsOpenReportPatient] = useState(false)
  const encounterId = useEncounterStore(state => state.encounterId)

  // const { status } = appointment

  // this function control the transition value
  const handleTransition = () => {
    setTransition(!transition)
  }

  // this function simulate click on disclosure
  const handleClickDisclosure = () => {
    disclosureRef.current.click()
  }

  const handleSidebarHoverOn = () => {
    setHoverSidebar(true)
  }

  const handleSidebarHoverOff = () => {
    if (recordOutPatientButton) return
    if (medicalHistoryButton) return
    if (studyHistoryButton) return
    if (orderHistoryButton) return

    // call this function only transition is active
    if (transition) handleClickDisclosure()
    setHoverSidebar(false)
  }

  const onClickOutPatientRecord = () => {
    setMedicalHistoryButton(false)
    setStudyHistoryButton(false)
    setOrderHistoryButton(false)
    setRecordOutPatientButton(!recordOutPatientButton)
  }

  const medicalHistoryToggleButton = () => {
    setRecordOutPatientButton(false)
    setStudyHistoryButton(false)
    setOrderHistoryButton(false)
    setMedicalHistoryButton(!medicalHistoryButton)
  }

  const toggleButtonStudyHistory = () => {
    setMedicalHistoryButton(false)
    setRecordOutPatientButton(false)
    setOrderHistoryButton(false)
    setStudyHistoryButton(!studyHistoryButton)
  }

  const toggleButtonOrderHistory = () => {
    setMedicalHistoryButton(false)
    setRecordOutPatientButton(false)
    setStudyHistoryButton(false)
    setOrderHistoryButton(!orderHistoryButton)
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
        <div
          className={`flex flex-col group relative ${
            hoverSidebar && 'cursor-pointer w-60'
          } w-24 z-50 bg-gray-100 transition-all duration-500`}
          onMouseOver={() => handleSidebarHoverOn()}
          onMouseLeave={() => handleSidebarHoverOff()}
        >
          <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
            {appointment.patient.photoUrl ? (
              <img
                src={appointment.patient.photoUrl}
                alt='Foto de Perfil'
                className={`border-1 border-white rounded-full w-15 h-15 object-cover transform origin-top duration-500 ${
                  transition && hoverSidebar ? 'scale-150' : '100'
                }`}
              />
            ) : (
              <NoProfilePicture
                className={`bg-gray-200 rounded-full border-gray-200 border-1 w-15 h-15 transform origin-top duration-500 ${
                  transition ? 'scale-150' : '100'
                }`}
              />
            )}
          </div>
          <Disclosure>
            {({ open }) => (
              <div
                className={`w-0 ${
                  hoverSidebar && 'w-auto opacity-100'
                } opacity-0 flex flex-col justify-start rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate scrollbar transform duration-500 ${
                  transition ? 'translate-y-12' : ''
                }`}
              >
                <Disclosure.Button
                  className='focus:outline-none'
                  style={{ height: '54px' }}
                  onClick={handleTransition}
                  ref={disclosureRef}
                >
                  <div className='flex flex-row flex-no-wrap justify-center items-center text-xl text-cool-gray-700 font-semibold truncate'>
                    <span className='overflow-hidden'>
                      {' '}
                      {toUpperLowerCase(
                        appointment.patient.givenName.split(' ')[0] + ' ' + appointment.patient.familyName.split(' ')[0]
                      )}
                      {appointment.patient.birthDate && ', '}{' '}
                      {differenceInYears(Date.now(), new Date(appointment.patient.birthDate)) || ''}
                    </span>
                    <ArrowDown className={` w-6 ${open ? 'rotate-180 transform' : ''}`} />
                  </div>
                  <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>
                    {appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                      ? 'Paciente sin cédula'
                      : 'CI ' + appointment.patient.identifier}
                  </span>
                </Disclosure.Button>
                <Transition
                  enter='transition-all duration-500 transform origin-top ease-linear'
                  enterFrom='opacity-0 scale-y-0'
                  enterTo='opacity-100 scale-y-100'
                  leave='transition-all duration-500 transform origin-top ease-linear'
                  leaveFrom='opacity-100 scale-y-100'
                  leaveTo='opacity-0 scale-y-0'
                >
                  <Disclosure.Panel className='focus:outline-none '>
                    <div className='max-h-32 overflow-y-auto'>
                      <div className='flex flex-col'>
                        <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>
                          Edad
                        </span>
                        <span className='text-lg font-semibold text-cool-gray-700'>
                          {differenceInYears(Date.now(), new Date(appointment.patient.birthDate)) || '-'}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>
                          Profesion
                        </span>
                        <span className='text-lg font-semibold text-cool-gray-700'>
                          {appointment.patient.job || '-'}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>
                          Teléfono
                        </span>
                        <span className='text-lg font-semibold text-cool-gray-700'>
                          {appointment.patient.phone || '-'}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>
                          Ciudad
                        </span>
                        <span className='text-lg font-semibold text-cool-gray-700'>
                          {appointment.patient.city || '-'}
                        </span>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          <div
            className={`flex flex-col flex-no-wrap items-center transform ease-linear duration-500  ${
              transition ? 'translate-y-12' : ''
            }`}
          >
            <div className='flex flex-col items-start'>
              <button
                className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none disabled:cursor-not-allowed`}
                onClick={() => medicalHistoryToggleButton()}
              >
                <HistoryIcon fill={`${medicalHistoryButton ? '#13A5A9' : '#6B7280'}`} />
                <div
                  className={`ml-1 w-0 ${
                    hoverSidebar && 'w-11/12 opacity-100'
                  } opacity-0 flex text-base font-medium text-gray-500 truncate ${
                    medicalHistoryButton && 'text-primary-600 font-semibold'
                  }`}
                  style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
                >
                  Antecedentes Clínicos
                </div>
              </button>
              <button
                className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`}
                onClick={() => onClickOutPatientRecord()}
              >
                <div className='w-5'>
                  <UserCircle className='w-5 h-5' fill={`${recordOutPatientButton ? '#13A5A9' : '#6B7280'}`} />
                </div>
                <div
                  className={`ml-1 w-0 ${
                    hoverSidebar && 'w-11/12 opacity-100'
                  } opacity-0 flex  text-base font-medium text-gray-500 truncate ${
                    recordOutPatientButton && 'text-primary-600 font-semibold'
                  }`}
                  style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
                >
                  Registro Ambulatorio
                </div>
              </button>
              <button
                className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`}
                onClick={() => toggleButtonStudyHistory()}
              >
                <StudyHistoryIcon fill={`${studyHistoryButton ? '#13A5A9' : '#6B7280'}`} />
                <div
                  className={`ml-1 w-0 ${
                    hoverSidebar && 'w-11/12 opacity-100'
                  } opacity-0 flex  text-base font-medium text-gray-500 truncate ${
                    studyHistoryButton && 'text-primary-600 font-semibold'
                  }`}
                  style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
                >
                  Historial de Estudios
                </div>
              </button>
              <button
                className={`flex flex-row flex-no-wrap justify-center items-center p-2 focus:outline-none`}
                onClick={() => toggleButtonOrderHistory()}
              >
                <StudyHistoryIcon fill={`${orderHistoryButton ? '#13A5A9' : '#6B7280'}`} />

                <div
                  className={`ml-1 w-0 ${
                    hoverSidebar && 'w-11/12 opacity-100'
                  } opacity-0 flex  text-base font-medium text-gray-500 truncate ${
                    orderHistoryButton && 'text-primary-600 font-semibold'
                  }`}
                  style={{ transition: 'width 0.5s linear, opacity 0.5s linear' }}
                >
                  Historial de Órdenes
                </div>
              </button>
            </div>
          </div>

          <button
            className={`absolute rounded-lg p-2 bg-orange-dark focus:outline-none text-white flex flex-no-wrap gap-2 w-${
              hoverSidebar ? '48' : '10'
            }
                  bottom-5 left-6 disabled:bg-orange-300 disabled:opacity-25
                `}
            style={{ transition: 'width 0.3s linear' }}
            onClick={() => setIsOpenReportPatient(!isOpenReportPatient)}
            disabled={encounterId ? false : true}
          >
            <div className='w-6'>
              <MdErrorOutline size={24} />
            </div>
            <div className={`truncate opacity-0 transition-opacity duration-500 ${hoverSidebar && 'opacity-100'}`}>
              Reportar Paciente
            </div>
          </button>
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

        <StudyHistoryCall
          containerRef={container}
          appointment={appointment}
          studyHistoryButton={studyHistoryButton}
          setStudyHistoryButton={setStudyHistoryButton}
          handleSidebarHoverOff={handleSidebarHoverOff}
        />

        <OrderHistoryCall
          containerRef={container}
          appointment={appointment}
          orderHistoryButton={orderHistoryButton}
          setOrderHistoryButton={setOrderHistoryButton}
          handleSidebarHoverOff={handleSidebarHoverOff}
        />
      </div>
      {encounterId && (
        <ModalReportPatient
          isOpen={isOpenReportPatient}
          setIsOpen={setIsOpenReportPatient}
          encounterId={encounterId}
          patient={appointment?.patient}
        />
      )}
      {children}
    </div>
  )
}

export default SidebarMenuCall
