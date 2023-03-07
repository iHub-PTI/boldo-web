import React, { useEffect, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import Print from './icons/Print'
import PrescriptionSelect from './icons/sumary-print/PrescriptionSelect'
import StudiesSelect from './icons/sumary-print/StudiesSelect'
import CheckWithoutBackground from './icons/sumary-print/CheckWithoutBackground'
import LoadingSpinner from './icons/sumary-print/LoadingSpinner'
import { useToasts } from './Toast'
import axios from 'axios'
import * as Sentry from '@sentry/react'


type AppointmentWithPatient = Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & {virtual: boolean}

// ********************* PRINCIPAL FUNCTION *********************
const SelectPrintOptions = ({virtual, ...appointment}: AppointmentWithPatient) => {
  // ********************* list of variables *********************
  const { addToast } = useToasts()
  // to handle popover state
  const [prescriptionsSelected, setPrescriptionsSelected] = useState<boolean>(false)
  const [studiesSelected, setStudiesSelected] = useState<boolean>(false)
  const [loadReports, setLoadReports] = useState<boolean>(false)
  // variable to show selected or unselected color on text and icon
  const colors = {
    selected: "#24AAAD",
    unselected: "#364152"
  }
  // variable to show selected or unselected color on background
  const backgroundColors = {
    selected: "#F8FFFF",
    unselected: ""
  }
  // variable to contains error messages
  const messages = {
    empty: 'Debe seleccionar al menos una opción para imprimir.',
    pescAndStudies: 'Se deben agregar recetas y estudios para imprimirlas.',
    lockedPescAndStudies: 'No se agegaron recetas ni órdenes de estudios.',
    prescriptions: 'Se deben agregar recetas para imprimirlas.',
    lockedPescriptions: 'No se agregó ninguna receta.',
    studies: 'Se deben agregar órdenes de estudios para imprimirlos.',
    lockedStudies: 'No se agregaró ninguna orden de estudios.',
    upcoming: 'Esta funcionalidad estará disponible durante la cita.',
    errorResponse: 'Inténtelo de nuevo más tarde.',
    serverError: 'Estamos trabajando para solucionarlo.'
  }


  // ********************* list of functions *********************
  // function that waits for the state and returns the color
  const getColor = (state: boolean):string => {
    return state ? colors.selected : colors.unselected
  }
  // function that waits for the state and returns the background color
  const getBackColor = (state: boolean):string => {
    return state ? backgroundColors.selected : backgroundColors.unselected
  }
  // function to change the prescription selected state
  const handlePrescriptions = () => setPrescriptionsSelected(!prescriptionsSelected)
  // function to change the study selected state
  const handleStudies = () => setStudiesSelected(!studiesSelected)
  const handleSubmitClick = () => {
    // there's not nothing to download
    if (!prescriptionsSelected && !studiesSelected) return addToast({ type: 'info', title:'Atención!', text:messages.empty })
    setLoadReports(true)
  }


  useEffect(() => {
    const load = async () => {
      const url = `/profile/doctor/appointments/${appointment.id}/encounter/reports`
      let reports: Array<string> = []
      // this neccessary to serialize the query param
      let qs = require('qs')
      
      // here we need know the options was selected
      if (prescriptionsSelected && studiesSelected) {
        reports.push("prescriptions","study_order")
      } else if (prescriptionsSelected) {
        reports.push("prescriptions")
      } else {
        reports.push("study_order")
      }

      await axios
        .get(url, {
          params: {
            reports: reports,
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
          },
          responseType: 'blob',
        })
        .then((res) => {
          if (res.status === 200) {
            // console.log('res: ', res)
            const date = new Date(appointment.start)
            const patientName = `${appointment.patient.familyName ?? 'sin nombre'}`
            const appointmentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            const appointmentTime = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}-${date.getMinutes()}`
            const filename = `consulta_${patientName}_${appointmentDate}_${appointmentTime}`
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const link = document.createElement('a')
            document.body.appendChild(link)
            link.href = window.URL.createObjectURL(blob)
            link.download = filename
            link.click()
            setTimeout(() => {
              // here we free an existing object URL we create previously
              window.URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            }, 0)
          } else if (res.status === 204) {
            if (appointment.status === 'open' || appointment.status === 'closed') {
              if (prescriptionsSelected && studiesSelected) { 
                addToast({ type: 'info', title: 'Atención!', text: messages.pescAndStudies })
              } else if (prescriptionsSelected) {
                addToast({ type: 'info', title: 'Atención!', text: messages.prescriptions })
              } else {
                addToast({ type: 'info', title: 'Atención!', text: messages.studies })
              }
            } else if (appointment.status === 'locked') {
              if (prescriptionsSelected && studiesSelected) { 
                addToast({ type: 'info', title: 'Atención!', text: messages.lockedPescAndStudies })
              } else if (prescriptionsSelected) {
                addToast({ type: 'info', title: 'Atención!', text: messages.lockedPescriptions })
              } else {
                addToast({ type: 'info', title: 'Atención!', text: messages.lockedStudies })
              }
            } else if (appointment.status === 'upcoming') {
              addToast({ type: 'info', title: 'Atención!', text: messages.upcoming })
            }
          }
        })
        .catch((err) => {
          // console.log(err)
          Sentry.setTags({
            'endpoint': url,
            'method': 'GET'
          })
          if (err.response) {
            // The response was made and the server responded with a 
            // status code that is outside the 2xx range.
            Sentry.setTags({
              'data': err.response.data,
              'headers': err.response.headers,
              'status_code': err.response.status
            })
            if (err.response.status === 500) {
              addToast({ type: 'error', title: 'Ocurrió un error inesperado.', text: messages.serverError })
            } else {
              addToast({ type: 'error', title: 'No fue posible descargar el resumen.', text: messages.errorResponse })
            }
          } else if (err.request) {
            // The request was made but no response was received
            Sentry.setTag('request', err.request)
          } else {
            // Something happened while preparing the request that threw an Error
            Sentry.setTag('message', err.message)
          }
          Sentry.captureMessage("Could not get the pdf")
          Sentry.captureException(err)
        })
        .finally(() => setLoadReports(false))

    }

    if (loadReports) load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadReports])


  return (
    // infor about button
    <Popover className='relative'>
      {({ open }) => (
        <>
          <Popover.Button className='focus:outline-none relative'>
            <Print
              bgColor='#27BEC2'
              iconColor='#FFFFFF'
              fromVirtual={virtual}
            />
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            // fixed and z-50 allow the component to be displayed on top of the rest
            enterTo="transform scale-100 opacity-100 fixed z-50"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel 
              className="absolute transform -translate-y-full translate-x-20 w-56 h-64 p-4 rounded-2xl shadow-xl bg-white"
            >
              {/* popover container */}
              <div className='flex flex-col justify-between h-full'>
                <div className='flex flex-col'>
                  <span className='pb-5'>Imprimir informe</span>
                  {/* list of options */}
                  <div className='flex flex-col gap-1 w-full'>
                    {/* PRESCRIPTIONS BUTTON */}
                    <button 
                      className={`flex flex-row gap-4 h-11 items-center rounded ${prescriptionsSelected ? '' : 'hover:bg-gray-100' } focus:outline-none`}
                      style={{backgroundColor: `${getBackColor(prescriptionsSelected)}`}}
                      onClick={handlePrescriptions}
                    >
                      <PrescriptionSelect 
                        currentColor={getColor(prescriptionsSelected)}
                      />
                      <span
                        style={{color: getColor(prescriptionsSelected)}}
                      >
                        Receta
                      </span>
                    </button>
                    {/* STUDIES BUTTON */}
                    <button 
                      className={`flex flex-row gap-4 h-11 items-center rounded ${studiesSelected ? '' : 'hover:bg-gray-100' } focus:outline-none`}
                      style={{backgroundColor: `${getBackColor(studiesSelected)}`}}
                      onClick={handleStudies}
                    >
                      <StudiesSelect 
                        currentColor={getColor(studiesSelected)}
                      />
                      <span
                        style={{color: getColor(studiesSelected)}}
                      >
                        Órdenes
                      </span>
                    </button>
                  </div>
                </div>
                <button 
                  className='flex flex-row flex-wrap gap-2 self-end p-2 rounded-lg focus:outline-none'
                  style={{ backgroundColor: colors.selected }}
                  onClick={handleSubmitClick}
                >
                  <span className='text-white'>Confirmar</span>
                  {loadReports ? <LoadingSpinner /> : <CheckWithoutBackground /> }
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}


export default SelectPrintOptions