import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { countDays, toUpperLowerCase } from '../../util/helpers'
import { StudyType, getCategorySvg, getOrigin } from './StudyHistory'
import { useToasts } from '../Toast'
import { ReactComponent as CalendarIcon } from "../../assets/calendar-detail.svg"
import { ReactComponent as SpinnerLoading } from '../../assets/spinner-loading.svg'
import NoProfilePicture from '../icons/NoProfilePicture'
import NotesIcon from '../icons/NotesIcon'
import PaperClipIcon from '../icons/PaperClipIcon'
import { AddedResults } from './AddedResults'
import { CardAttached } from './CardAttached'


type PropsDetailStudy = {
  selectedStudy: StudyType
}

const getCategoryLabel = (category = '') => {
  if (!category) return
  switch (category.toLowerCase()) {
    case 'laboratory':
      return 'Laboratorio';
    case 'diagnostic imaging':
    case 'image':
      return 'Imágenes';
    case 'other':
      return 'Otros';
  }
};

export const CardDetailStudy: React.FC<PropsDetailStudy> = ({
  selectedStudy
}) => {

  const { addToast } = useToasts()

  const [studyOrder, setStudyOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getServiceRequest = (id) => {
    let url = '/profile/doctor/serviceRequest/' + id
    setLoading(true)
    setError(null)
    axios.get(url)
      .then(res => {
        setStudyOrder(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        setError(error)
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el detalle de la orden.' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET,
          tags
        )
      })
      .finally(() => setLoading(false));
  }

  const getDiagnosticReport = (id) => {
    let url = '/profile/doctor/diagnosticReport/' + id
    setLoading(true)
    setError(null)
    axios.get(url)
      .then(res => {
        setStudyOrder(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        setError(error)
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        addToast({ type: 'error', title: 'Error', text: 'Ha ocurrido un error al traer el detalle del estudio.' })
        handleSendSentry(
          error,
          ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET,
          tags
        )
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!selectedStudy) return
    if (selectedStudy.type === 'serviceRequest')
      getServiceRequest(selectedStudy.id)
    else if (selectedStudy.type === 'diagnosticReport')
      getDiagnosticReport(selectedStudy.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudy])

  if (loading) return (
    <div className='flex flex-col'>
      <div className='flex flex-row w-full h-80 justify-center items-center'>
        <SpinnerLoading />
      </div>
    </div>
  )

  if (!selectedStudy) return (
    <div className='flex w-full h-80 items-center justify-center text-gray-200 font-bold text-3xl'>
      Seleccione un estudio para mostrar
    </div>
  )

  const getStudies = (studies = []) => {
    return studies.map(x => (
      <li className='text-cool-gray-700 text-sm'>{x.display}</li>
    ))
  }

  if (error) {
    return null
  }

  if (selectedStudy.type === 'serviceRequest') {

    let doctor = studyOrder?.doctor

    const getDoctor = (givenName = '', familyName = '', gender = '', specializations = []) => {

      let doctorName = `${gender === 'male' ? 'Dr.' : 'Dra.'} ${toUpperLowerCase(givenName.split(' ')[0] + ' ' + familyName.split(' ')[0])}`

      return (
        <div className='flex flex-col'>
          <div className='text-cool-gray-700' style={{ lineHeight: '16px' }}>
            {doctorName}
          </div>
          {/* Specialty and organization */}
          <div className='flex flex-row gap-1'>
            <div className='text-xs w-96 truncate' style={{ color: '#718096', lineHeight: '16px' }}
              title={specializations.map(spe => spe.description).join(' ⦁ ')}
            >
              {specializations.map(spe => spe.description).join(' ⦁ ')}
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        {/* Order Header */}
        <div className='flex flex-col p-2 gap-1'>
          <h1 className='font-semibold text-gray-500 text-xs'>Orden</h1>
          {/* Doctor picture */}
          <div className='flex flex-row gap-4 w-64 h-11 items-center'>
            {doctor?.photoUrl ? (
              <img
                src={doctor?.photoUrl}
                alt='Foto de Perfil'
                className='flex-none border-1 border-white w-10 h-10 rounded-full object-cover'
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
            <div className='ml-2 text-gray-500'>
              {studyOrder?.authoredDate && countDays(studyOrder?.authoredDate)}
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {studyOrder?.diagnosis &&
          <div className='flex flex-col gap-1'>
            <div className='text-primary-500'>
              Impresión diagnóstica
            </div>
            <div className='font-semibold' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
              {studyOrder?.diagnosis}
            </div>
          </div>
        }

        {/* Requested studies */}
        <div className='flex flex-col gap-2 mt-3'>
          <div className='text-primary-500'>
            Estudios solicitados
          </div>
          <div className='flex flex-col p-3' style={{ border: '3px solid #F6F4F4', borderRadius: '16px' }}>
            {/* Header Study */}
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row gap-2'>
                {getCategorySvg(studyOrder?.category)}
                <div className='text-cool-gray-700 text-sm' style={{ lineHeight: '20px' }}>
                  {getCategoryLabel(studyOrder?.category)}
                </div>
              </div>
              {studyOrder?.urgent &&
                <div className='flex flex-row justify-center'
                  style={{
                    padding: '1px 6px',
                    width: '54px',
                    height: '18px',
                    background: '#E8431F',
                    borderRadius: '4px'
                  }}>
                  <span className='font-semibold text-white' style={{
                    fontSize: '10px',
                    lineHeight: '16px',
                    letterSpacing: '0.5px'
                  }}>urgente</span>
                </div>
              }
            </div>
            {/* Body Study */}
            <div className='flex flex-row pt-1'>
              <ul className="list-disc list-inside ml-2 pt-2">
                {getStudies(studyOrder?.studiesCodes)}
              </ul>
            </div>
            {/* Observation */}
            {studyOrder?.notes &&
              <div className='flex flex-col mt-2'>
                <div className='text-sm text-cool-gray-700'>Observaciones:</div>
                <div className='text-sm text-cool-gray-700'>
                  {studyOrder?.notes}
                </div>
              </div>
            }
            <AddedResults diagnosticReports={studyOrder?.diagnosticReports ?? []} />
          </div>
        </div>
      </>
    )
  }

  if (selectedStudy.type === 'diagnosticReport') {
    return (<div className='flex flex-col gap-5'>

      {/* Header Study */}
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-2'>
            {getCategorySvg(studyOrder?.category, 27, 27)}
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
            {/* <div className='flex flex-row justify-end'>
              <div className='flex flex-row justify-end w-full'>
                <div className='text-orange-dark focus:outline-none text-sm'>
                  Sin orden asociada
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>


      {studyOrder?.sourceType &&
        <div className='flex flex-col'>
          <div className='text-primary-500'>
            Origen
          </div>
          <span className='font-semibold'>
            {getOrigin(studyOrder?.sourceType)}
          </span>
        </div>
      }

      <div className='flex flex-col gap-5'>
        <div className='flex flex-row items-center gap-2'>
          <PaperClipIcon />
          <h2 className='text-cool-gray-700 font-medium text-xl'>Adjuntos</h2>
        </div>
        {studyOrder?.attachmentUrls === 0 && <div className='text-sm text-cool-gray-700 mb-2 mt-3'>Aún no se han añadido resultados.</div>}

        <div className='flex flex-col gap-1'>
          {studyOrder?.attachmentUrls?.map((data, idx) =>
            <CardAttached
              key={idx}
              fileData={data}
              effectiveDate={studyOrder?.effectiveDate}
              sourceType={studyOrder?.sourceType}
            />
          )}
        </div>
        {studyOrder?.patientNotes &&
          <div className='flex flex-row gap-1'>
            <div className='flex flex-col w-6 justify-start pt-1'>
              <NotesIcon />
            </div>
            <div className='flex flex-col text-xs' style={{ color: '#424649' }}>
              <span className='font-semibold'>Notas</span>
              <p>{studyOrder?.patientNotes}</p>
            </div>
          </div>
        }
      </div>
    </div>)

  }
}