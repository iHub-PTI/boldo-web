import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState, Fragment } from 'react'
import { ReactComponent as CalendarIcon } from '../../assets/calendar-detail.svg'
import { ReactComponent as SpinnerLoading } from '../../assets/spinner-loading.svg'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { countDays, toUpperLowerCase } from '../../util/helpers'
import { useToasts } from '../Toast'
import NoProfilePicture from '../icons/NoProfilePicture'
import NotesIcon from '../icons/NotesIcon'
import PaperClipIcon from '../icons/PaperClipIcon'
import { AddedResults } from './AddedResults'
import { CardAttached } from './CardAttached'
import { StudyType, getCategorySvg, getOrigin } from './StudyHistory'
import { Dialog, Transition } from '@headlessui/react'
import { ReactComponent as CloseIcon } from '../../assets/close.svg'
import OrderDetailStudy from '../studiesorder/OrderDetailStudy'

type PropsDetailStudy = {
  selectedStudy: StudyType
  darkMode?: boolean
  isCall?: boolean
}

export const getCategoryLabel = (category = '') => {
  if (!category) return
  switch (category.toLowerCase()) {
    case 'laboratory':
      return 'Laboratorio'
    case 'diagnostic imaging':
    case 'image':
      return 'Imágenes'
    case 'other':
      return 'Otros'
  }
}

export const CardDetailStudy: React.FC<PropsDetailStudy> = ({
  selectedStudy,
  darkMode = false,
  isCall = false,
  ...props
}) => {
  const { addToast } = useToasts()

  const [studyOrder, setStudyOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false)

  function closeModalOrder() {
    setIsOpenOrderDetail(false)
  }

  function openModalOrder() {
    setIsOpenOrderDetail(true)
  }

  const getServiceRequest = id => {
    let url = '/profile/doctor/serviceRequest/' + id
    setLoading(true)
    setError(null)
    axios
      .get(url)
      .then(res => {
        setStudyOrder(res.data)
        console.log(res.data)
      })
      .catch(error => {
        setError(error)
        const tags = {
          endpoint: url,
          method: 'GET',
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el detalle de la orden.' })
        handleSendSentry(error, ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET, tags)
      })
      .finally(() => setLoading(false))
  }

  const getDiagnosticReport = id => {
    let url = '/profile/doctor/diagnosticReport/' + id
    setLoading(true)
    setError(null)
    axios
      .get(url)
      .then(res => {
        setStudyOrder(res.data)
        console.log(res.data)
      })
      .catch(error => {
        setError(error)
        const tags = {
          endpoint: url,
          method: 'GET',
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el detalle del estudio.' })
        handleSendSentry(error, ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET, tags)
      })
      .finally(() => setLoading(false))
  }

  //classes
  const classTextTitle = `${darkMode ? 'text-white' : 'text-primary-500'}`
  const classDesc = `${darkMode ? 'text-white' : ''}`
  const classBoxDarkMode = `${darkMode ? 'bg-bluish-500 p-2 rounded-lg' : ''}`

  useEffect(() => {
    if (!selectedStudy) return
    if (selectedStudy.type === 'serviceRequest') getServiceRequest(selectedStudy.id)
    else if (selectedStudy.type === 'diagnosticReport') getDiagnosticReport(selectedStudy.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudy])

  if (loading)
    return (
      <div className='flex flex-col'>
        <div className='flex flex-row w-full h-80 justify-center items-center'>
          <SpinnerLoading />
        </div>
      </div>
    )

  if (!selectedStudy)
    return (
      <div className='flex w-full h-80 items-center justify-center text-gray-200 font-bold text-3xl'>
        Seleccione un elemento para mostrar
      </div>
    )

  const getStudies = (studies = []) => {
    return studies.map((x, idx) => (
      <li key={idx} className='text-cool-gray-700 text-sm'>
        {x.display}
      </li>
    ))
  }

  if (error) {
    return null
  }

  if (selectedStudy.type === 'serviceRequest') {
    let doctor = studyOrder?.doctor

    const getDoctor = (givenName = '', familyName = '', gender = '', specializations = []) => {
      let doctorName = `${gender === 'male' ? 'Dr.' : 'Dra.'} ${toUpperLowerCase(
        givenName.split(' ')[0] + ' ' + familyName.split(' ')[0]
      )}`

      return (
        <div className={'flex flex-col'}>
          <div className='text-cool-gray-700' style={{ lineHeight: '16px' }}>
            {doctorName}
          </div>
          {/* Specialty and organization */}
          <div className='flex flex-row gap-1'>
            <div
              className={`text-xs ${isCall ? 'w-72' : 'w-96'} truncate`}
              style={{ color: '#718096', lineHeight: '16px' }}
              title={specializations.map(spe => spe.description).join(' ⦁ ')}
            >
              {specializations.map(spe => spe.description).join(' ⦁ ')}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={isCall ? 'mx-3' : ''} {...props}>
        {/* Order Header */}
        <div className={`flex flex-col p-2 gap-1 ${classBoxDarkMode}`}>
          <h1 className='font-semibold text-gray-500 text-xs'>Orden</h1>
          {/* Doctor picture */}
          <div className='flex flex-row gap-4 w-64 h-11 items-center mb-1'>
            {doctor?.photoUrl ? (
              <img
                src={doctor?.photoUrl}
                alt='Foto de Perfil'
                className='flex-none border-2 border-bluish-500 w-10 h-10 rounded-full object-cover'
              />
            ) : (
              <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-10 h-10' />
            )}
            {/* Doctor info */}
            {doctor && getDoctor(doctor.givenName, doctor.familyName, doctor.gender, doctor.specializations)}
          </div>
          {/* <div className='flex flex-row justify-end w-full'>
            <a href='#a' className='text-orange-dark border-b border-orange-dark focus:outline-none text-sm'>
              Ver consulta origen
            </a>
          </div> */}
          <div className='font-semibold text-gray-500 text-xs'>Solicitado en fecha</div>
          <div className='flex flex-row items-center'>
            <CalendarIcon />
            <div className='text-cool-gray-700' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
              {studyOrder?.authoredDate && moment(studyOrder?.authoredDate).format('DD/MM/YYYY')}
            </div>
            <div className='ml-2 text-gray-500'>{studyOrder?.authoredDate && countDays(studyOrder?.authoredDate)}</div>
          </div>
        </div>

        {/* Diagnosis */}
        {studyOrder?.diagnosis && (
          <div className={`flex flex-col gap-1 ${isCall ? 'mt-2' : ''}`}>
            <div className={classTextTitle}>Impresión diagnóstica</div>
            <div className={`font-semibold ${classDesc}`} style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
              {studyOrder?.diagnosis}
            </div>
          </div>
        )}

        {/* Requested studies */}
        <div className='flex flex-col gap-2 mt-3'>
          <div className={classTextTitle}>Estudios solicitados</div>
          <div
            className={`flex flex-col p-3 ${classBoxDarkMode}`}
            style={{ border: '3px solid #F6F4F4', borderRadius: '16px' }}
          >
            {/* Header Study */}
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row gap-2 items-center'>
                {getCategorySvg(studyOrder?.category, 24, 24)}
                <div className='text-cool-gray-700 text-sm' style={{ lineHeight: '20px' }}>
                  {getCategoryLabel(studyOrder?.category)}
                </div>
              </div>
              {studyOrder?.urgent && (
                <div
                  className='flex flex-row justify-center'
                  style={{
                    padding: '1px 6px',
                    width: '54px',
                    height: '18px',
                    background: '#E8431F',
                    borderRadius: '4px',
                  }}
                >
                  <span
                    className='font-semibold text-white'
                    style={{
                      fontSize: '10px',
                      lineHeight: '16px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    urgente
                  </span>
                </div>
              )}
            </div>
            {/* Body Study */}
            <div className='flex flex-row pt-1'>
              <ul className='list-disc list-inside ml-2 pt-2'>{getStudies(studyOrder?.studiesCodes)}</ul>
            </div>
            {/* Observation */}
            {studyOrder?.notes && (
              <div className='flex flex-col mt-2'>
                <div className='text-sm text-cool-gray-700'>Observaciones:</div>
                <div className='text-sm text-cool-gray-700'>{studyOrder?.notes}</div>
              </div>
            )}
            <AddedResults diagnosticReports={studyOrder?.diagnosticReports ?? []} />
          </div>
        </div>
      </div>
    )
  }

  if (selectedStudy.type === 'diagnosticReport') {
    return (
      <>
        <div className='flex flex-col gap-5'>
          {/* Header Study */}
          <div className={`flex flex-col gap-2 ${classBoxDarkMode}`}>
            <div className='flex flex-row justify-between'>
              <div className={`flex flex-row gap-2 items-center`}>
                {getCategorySvg(studyOrder?.category, 36, 36, false)}
                <div className='text-cool-gray-700 text-xl' style={{ lineHeight: '20px' }}>
                  {getCategoryLabel(studyOrder?.category)}
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='font-semibold text-gray-500 text-xs'>Resultados con fecha</div>
              <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center'>
                  <CalendarIcon />
                  <div className='text-cool-gray-700' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
                    {studyOrder?.effectiveDate && moment(studyOrder?.effectiveDate).format('DD/MM/YYYY')}
                  </div>
                  <div className='ml-2 text-gray-500'>
                    {studyOrder?.effectiveDate && countDays(studyOrder?.effectiveDate)}
                  </div>
                </div>
                <div className='flex flex-row justify-end'>
                  <div className='flex flex-row justify-end w-full'>
                    {studyOrder?.serviceRequestId ? (
                      <button
                        className='text-orange-dark focus:outline-none text-sm underline'
                        onClick={openModalOrder}
                      >
                        Ver orden de estudios
                      </button>
                    ) : (
                      <span className='text-orange-dark focus:outline-none text-sm'> Sin orden asociada</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {studyOrder?.sourceType && (
            <div className='flex flex-col'>
              <div className={classTextTitle}>Origen</div>
              <span className={`font-semibold ${classDesc}`}>{getOrigin(studyOrder?.sourceType)}</span>
            </div>
          )}

          {studyOrder?.description && (
            <div className='flex flex-col'>
              <div className={classTextTitle}>Descripción</div>
              <span className={`font-normal ${classDesc}`}>{studyOrder?.description}</span>
            </div>
          )}

          <div className={`flex flex-col gap-5 ${classBoxDarkMode}`}>
            <div className='flex flex-row items-center gap-2'>
              <PaperClipIcon />
              <h2 className='text-cool-gray-700 font-medium text-xl'>Adjuntos</h2>
            </div>
            {studyOrder?.attachmentUrls === 0 && (
              <div className='text-sm text-cool-gray-700 mb-2 mt-3'>Aún no se han añadido resultados.</div>
            )}

            <div className='flex flex-col gap-1'>
              {studyOrder?.attachmentUrls?.map((data, idx) => (
                <CardAttached
                  key={idx}
                  fileData={data}
                  effectiveDate={studyOrder?.effectiveDate}
                  sourceType={studyOrder?.sourceType}
                />
              ))}
            </div>
            {studyOrder?.patientNotes && (
              <div className='flex flex-row gap-1'>
                <div className='flex flex-col w-6 justify-start pt-1'>
                  <NotesIcon />
                </div>
                <div className='flex flex-col text-xs' style={{ color: '#424649' }}>
                  <span className='font-semibold'>Notas</span>
                  <p>{studyOrder?.patientNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <Transition appear show={isOpenOrderDetail} as={Fragment}>
          <Dialog as='div' className='relative z-10' onClose={closeModalOrder}>
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
                    <div className='mt-2'>
                      <button className='focus:outline-none absolute right-2 top-2' onClick={closeModalOrder}>
                        <CloseIcon />
                      </button>
                      <OrderDetailStudy orderID={studyOrder?.serviceRequestId} />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    )
  }
}
