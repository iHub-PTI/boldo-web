import React, { useEffect, useState } from 'react'
// import { Avatar, Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import { useRouteMatch } from 'react-router-dom'
// import moment from 'moment'
//import useStyles from './style'
import * as Sentry from '@sentry/react'
import { useToasts } from '../../components/Toast'
import useWindowDimensions from '../../util/useWindowDimensions'
import UserCircle from "../../components/icons/patient-register/UserCircle";
import { HEIGHT_NAVBAR, HEIGHT_BAR_STATE_APPOINTMENT, WIDTH_XL, ORGANIZATION_BAR } from "../../util/constants"
import PastIcon from '../../components/icons/HistoryIcon'
import NoProfilePicture from '../../components/icons/NoProfilePicture'
import { Disclosure, Transition } from '@headlessui/react'
import { toUpperLowerCase } from '../../util/helpers'
import ArrowDown from '../../components/icons/ArrowDown'
import differenceInYears from 'date-fns/differenceInYears'


type PropsButton = {
  setShow: (value: boolean) => void,
  show: boolean,
  disabled?: boolean,
  IconElement?: React.ElementType,
  title: string,
  callBackSwitch?: () => void
}

//navigation buttons within the patient profile
const ButtonSlide: React.FC<PropsButton> = ({ setShow, show, disabled, IconElement, title, callBackSwitch }) => {

  const Icon = IconElement

  return (
    <button
      className='focus:outline-none p-2 hover:bg-bluish-500 rounded-md transition-colors duration-200 disabled:cursor-not-allowed w-60 h-16'
      onClick={() => {
        setShow(true)
        callBackSwitch()
      }}
      //FIXME:  comments in the file on line 23 InPersonAppointment.tsx
      disabled={disabled}
      title={`${disabled ? 'No es posible visualizar esta sección en una cita que se encuentra cerrada' : title}`}
    >
      <div className={`pl-2 text-gray-500 flex flex-row justify-start gap-2  ${show && 'text-primary-600 font-semibold'}`}>
        <div>
          <Icon />
        </div>
        <div
          className='text-left font-medium text-base leading-6 font-sans w-full pb-2'
          style={{
            letterSpacing: '0.15px',
            borderBottom: '0.5px solid #E0DEDE'
          }}>
          {title.split(' ')[0]}
          <br />
          {title.split(' ')[1]}
        </div>
      </div>
    </button>
  )
}

const PatientRecord = (props) => {
  const { givenName, familyName, birthDate, identifier, city = '', phone = '', photoUrl = '', job } = props.patient;
  //const { addErrorToast, addToast } = useToasts()
  const [transition, setTransition] = useState<boolean>(false)
  const { status } = props.appointment


  const handleTransition = () => {
    setTransition(!transition)
  }
  const handleSwitchButtonRecordOutPatient = () =>
    props.setShowMedicalHistory(false)

  const handleSwitchButtonMedicalHistory = () =>
    props.setOutpatientRecordShow(false)

  return (
    <div className='flex flex-col flex-1' style={{ padding: '15px' }}>
      <div className='flex flex-col w-auto flex-no-wrap mt-10 items-center'>
        {photoUrl
          ? <img src={photoUrl} alt='Foto de Perfil'
            className={`border-2 border-white rounded-full w-24 h-24 object-cover transform origin-top duration-500 ${transition ? 'scale-150' : '100'}`} />
          : <NoProfilePicture className={`bg-gray-200 rounded-full border-2 w-24 h-24 transform origin-top duration-500 ${transition ? 'scale-150' : '100'}`} />
        }
      </div>
      <Disclosure>
        {({ open }) => (
          <div className={`w-auto opacity-100 flex flex-col justify-start rounded-lg mx-2 p-2 gap-5 mt-5 mb-5 truncate scrollbar transform duration-500 ${transition ? 'translate-y-12' : ''}`} style={{ height: open ? '310px' : '', overflowY: 'auto' }}>
            <Disclosure.Button className="focus:outline-none" style={{ height: '54px' }} onClick={handleTransition}>
              <div className='flex flex-row flex-no-wrap justify-center items-center text-xl text-cool-gray-700 font-semibold truncate'>
                <span className='truncate'> {toUpperLowerCase(givenName.split(' ')[0] + ' ' + familyName.split(' ')[0])}{birthDate && ', '} {differenceInYears(Date.now(), new Date(birthDate)) || ''}</span>
                <ArrowDown className={`${open ? 'rotate-180 transform' : ''}`} />
              </div>
              <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>{identifier == null || identifier.includes('-')
                ? 'Paciente sin cédula'
                : 'CI ' + identifier}</span>
            </Disclosure.Button>
            <Transition
              enter="transition-all duration-500 transform origin-top ease-linear"
              enterFrom="opacity-0 scale-y-0"
              enterTo="opacity-100 scale-y-100"
              leave="transition-all duration-500 transform origin-top ease-linear"
              leaveFrom="opacity-100 scale-y-100"
              leaveTo="opacity-0 scale-y-0"
            >
              <Disclosure.Panel className={`focus:outline-none`}>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Edad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(birthDate)) || '-'}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Profesion</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{job || '-'}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Teléfono</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{phone || '-'}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-base font-normal' style={{ color: '#ABAFB6' }}>Ciudad</span>
                  <span className='text-lg font-semibold text-cool-gray-700'>{city || '-'}</span>
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>

      <div className={`flex flex-col justify-center items-center gap-1 transform ease-linear duration-500 ${transition ? 'translate-y-12' : ''}`}>
        <ButtonSlide
          show={props.showMedicalHistory}
          setShow={props.setShowMedicalHistory}
          disabled={
            //(status !== 'closed' && status !== 'open') ||
            props.disabledRedcordButton}
          IconElement={() =>
            <PastIcon
              fill={`${props.showMedicalHistory ? '#13A5A9' : '#6B7280'}`}
            />}
          title={'Antecedentes Clínicos'}
          callBackSwitch={handleSwitchButtonMedicalHistory}
        />
        <ButtonSlide
          show={props.outpatientRecordShow}
          setShow={props.setOutpatientRecordShow}
          disabled={
            // (status !== 'closed' && status !== 'open') ||
            props.disabledRedcordButton}
          IconElement={() =>
            <UserCircle
              fill={`${props.outpatientRecordShow ? '#13A5A9' : '#6B7280'}`}
            />}
          title={"Registro Ambulatorio"}
          callBackSwitch={handleSwitchButtonRecordOutPatient}
        />
      </div>
    </div>
  )
}

export default (props) => {

  const { appointment } = props;
  //const history = useHistory()
  const { addToast } = useToasts()
  const [encounter, setEncounter] = useState<{}>();
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson')
  const id = match?.params.id
  const { width: screenWidth } = useWindowDimensions()



  useEffect(() => {
    const load = async () => {
      const url = `/profile/doctor/appointments/${id}/encounter`
      try {
        const res = await axios.get(url);
        setEncounter(res.data.encounter)
        // setInitialLoad(false)
      } catch (err) {
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          'appointment_id': id
        })
        if (err.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTag('data', err.response.data)
          Sentry.setTag('headers', err.response.headers)
          Sentry.setTag('status_code', err.response.status)
        } else if (err.request) {
          // The request was made but no response was received
          Sentry.setTag('request', err.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', err.message)
        }
        Sentry.captureMessage("Could not get the encounter")
        Sentry.captureException(err)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudo cargar la sección del perfil del paciente. ¡Inténtelo nuevamente más tarde!'
        })
        // setInitialLoad(false)
      }
    }

    load()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className='flex flex-col h-full overflow-y-auto scrollbar'
      style={{
        backgroundColor: '#F4F5F7',
        height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`}`
      }}
    >
      {appointment !== undefined && encounter !== undefined ?
        <PatientRecord
          patient={appointment.patient}
          encounter={encounter}
          id={id}
          appointment={appointment}
          disabledRedcordButton={props.disabledRedcordButton}
          outpatientRecordShow={props.outpatientRecordShow}
          setOutpatientRecordShow={props.setOutpatientRecordShow}
          showMedicalHistory={props.showMedicalHistory}
          setShowMedicalHistory={props.setShowMedicalHistory}
        /> :
        <div className='flex h-full justify-center items-center'>
          <div className='bg-gray-100 rounded-full'>
            <svg
              className='w-6 h-6 text-secondary-500 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          </div>
        </div>}
    </div>
  )

}
