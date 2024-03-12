import { Dialog, Transition } from '@headlessui/react'
import { differenceInYears } from 'date-fns'
import moment from 'moment'
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { toUpperLowerCase } from '../../util/helpers'
import IconZoom from './icon/zoom.svg'
import CloseIcon from '../../assets/close.svg'
import useSendReportPatient from '../../hooks/useSendReportPatient'
import { ReactComponent as Spinner } from '../../assets/spinner.svg'
import { useToasts } from '../Toast'

interface PropsModalReportPatient {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  encounterId: string
  patient: iHub.Patient
}

const ModalReportPatient: React.FC<PropsModalReportPatient> = ({ isOpen, setIsOpen, encounterId, patient }) => {
  const age = differenceInYears(Date.now(), new Date(patient?.birthDate))
  const infoTitle =
    toUpperLowerCase(patient?.givenName.split(' ')[0] + ' ' + patient?.familyName.split(' ')[0]) + ', ' + age + ' años'
  const identifier = patient?.identifier.includes('-') ? 'Paciente sin cedula' : patient?.identifier
  const gender = patient?.gender === 'male' ? 'Masculino' : 'Femenino'

  const [previewPhoto, setPreviewPhoto] = useState(false)

  const [commentReason, setCommentReason] = useState('')

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentReason(event.target.value)
  }

  const { addToast } = useToasts()

  const { data, loading, error, fetchSendReportPatient } = useSendReportPatient({ patientId: patient?.id, encounterId })

  useEffect(() => {
    if (data) {
      setCommentReason('')
      setIsOpen(false)
      addToast({
        type: 'success',
        title: 'Notificación de reporte',
        text: 'Su reporte ha sido enviado con éxito',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (error) {
      addToast({
        type: 'error',
        title: 'Ha ocurrido un inconveniente al enviar el reporte',
        text: `Detalles del inconveniente: ${error}`,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} as='div' className='relative z-40'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <button className='absolute top-5 right-5 focus:outline-none' onClick={() => setIsOpen(false)}>
                    <img src={CloseIcon} alt='' />
                  </button>
                  <section className='space-y-4'>
                    <h1 className='text-dark-cool font-bold text-xl mb-4'>Reportar Paciente</h1>
                    <p className='text-gray-500 font-normal text-base'>
                      Por la naturaleza crítica y sensible de la información de salud, es fundamental mantener la
                      integridad y exactitud de los datos del paciente en todo momento.
                    </p>
                    <p className='text-gray-500 font-normal text-base'>
                      Para garantizar la confidencialidad y la calidad de la información, le solicitamos que, en caso de
                      observar o sospechar de cualquier discrepancia, inconsistencia o error en la identificación del
                      paciente, comunique inmediatamente dicha información a través del formulario de reportes.
                    </p>
                    {/* info del paciente */}
                    <div className='flex flex-row gap-3'>
                      {patient?.photoUrl && (
                        <div className='w-24 h-24 relative'>
                          <img src={patient?.photoUrl} alt={patient?.givenName} className='rounded-full w-24 h-24' />
                          <button
                            className='absolute right-0 bottom-0 focus:outline-none'
                            onClick={() => setPreviewPhoto(!previewPhoto)}
                          >
                            <img src={IconZoom} alt='zoom' />
                          </button>
                        </div>
                      )}
                      <div className='flex flex-col'>
                        <h4 className='text-dark-cool font-normal text-xl'>{infoTitle}</h4>
                        <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>
                          CI {identifier} Fecha de Nacimiento:{' '}
                          {patient?.birthDate && moment(patient?.birthDate).format('DD/MM/YYYY')}
                        </span>
                        <span className='font-semibold text-base' style={{ color: '#ABAFB6' }}>
                          Sexo {gender}
                        </span>
                      </div>
                    </div>
                    <h1 className='text-dark-cool font-bold text-xl mb-4'>Describa el problema encontrado</h1>
                    <p className='text-gray-500 font-normal text-base'>
                      Reporte de cualquier problema relacionado con la identidad del paciente en nuestros registros.
                    </p>
                    <div className='relative'>
                      <textarea
                        rows={7}
                        placeholder='Escriba aquí'
                        className='border-2 border-bluish-500 p-3 rounded-lg focus:outline-none w-full pt-4'
                        maxLength={500}
                        value={commentReason}
                        onChange={e => handleChange(e)}
                      />
                      <span className='absolute right-1 top-1 text-sm text-gray-500'>{commentReason.length}/500</span>
                    </div>
                    <div className='flex flex-row justify-end gap-3'>
                      <button
                        className='rounded-lg text-white p-2 focus:outline-none'
                        style={{ backgroundColor: '#EB8B76' }}
                        onClick={() => setIsOpen(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className='rounded-lg text-white p-2 bg-primary-500 focus:outline-none flex justify-center'
                        style={{ width: '128px' }}
                        onClick={() => fetchSendReportPatient(commentReason.trim())}
                      >
                        {loading ? <Spinner /> : 'Enviar Reporte'}
                      </button>
                    </div>
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ModalPhotoPreview urlPhoto={patient?.photoUrl} isOpen={previewPhoto} setIsOpen={setPreviewPhoto} />
    </>
  )
}

const ModalPhotoPreview = ({ urlPhoto, isOpen, setIsOpen }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} as='div' className='relative z-50'>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <button className='absolute top-2 right-1 focus:outline-none' onClick={() => setIsOpen(false)}>
                  <img src={CloseIcon} alt='' />
                </button>
                <div className='p-1'>
                  <img src={urlPhoto} alt={'vista previa'} loading='lazy' />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalReportPatient
