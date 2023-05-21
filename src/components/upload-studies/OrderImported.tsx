import React, { useContext } from 'react';
import { OrderStudyImportedContext } from '../../contexts/OrderImportedContext';
import DeleteOrderImported from '../icons/upload-icons/DeleteOrderImported';
import DateSection from './DateSection';
import DoctorProfile from './DoctorProfile';
import Category from './Category';
import Urgency from './Urgency';


type Props = {
  handleShowOrderImported: () => void;
}


const OrderImported = (props: Props) => {
  const {handleShowOrderImported} = props
  const {OrderImported, setOrderImported} = useContext(OrderStudyImportedContext)

  return(
    <div className='flex flex-col space-y-8 p-5'>
      {/* the order was imported */}
      <div className='flex flex-row justify-between border-b-2'>
        <p className='not-italic font-medium text-base leading-6'>
          Orden {OrderImported?.orderNumber && `Nro ${OrderImported.orderNumber} `}seleccionada
        </p>
        <button
          className='focus:outline-none'
          onClick={() => {
            handleShowOrderImported();
            setOrderImported({} as Boldo.OrderStudy)
          }}
        >
          <DeleteOrderImported />
        </button>
      </div>
      {/* profile and date */}
      <div className='flex flex-row justify-between'>
        {/* profile */}
        <DoctorProfile doctor={OrderImported?.doctor as unknown as iHub.Doctor} />
        {/* date section */}
        <DateSection authoredDate={OrderImported?.authoredDate} />
      </div>
      {/* diagnosis */}
      { OrderImported?.diagnosis &&
        <div className='flex flex-col space-y-1'>
          <p className='not-italic font-normal text-base leading-4 text-teal-400'>Diagnóstico</p>
          <p className='not-italic font-semibold text-sm leading-4 text-black'>{OrderImported.diagnosis}</p>
        </div>
      }
      {/* requested studies and attachments */}
      <div className='flex flex-col space-y-6'>
        <p className='not-italic font-normal text-base leading-4 text-teal-400'>Estudios Solicitados</p>
        <div className='flex flex-col space-y-5 px-4'>
          {/* requested studies */}
          <div className='flex flex-col space-y-1'>
            {/* category and urgency */}
            <div className='flex flex-row space-x-4'>
              <Category category={OrderImported?.category ?? ''}/>
              {OrderImported?.urgent && <Urgency />}
            </div>
            {/* list of requested studies */}
            {OrderImported?.studiesCodes?.map((code) => (<li className='not-italic font-normal text-sm leading-4 text-gray-700'>{code?.display ?? ''}</li>))}
          </div>
          {/* observations */}
          { OrderImported?.notes &&
            <div className='flex flex-col space-y-2'>
              <p className='not-italic font-normal text-sm leading-5 text-gray-700'>Observaciones:</p>
              <p className='not-italic font-normal text-sm leading-5 text-gray-700'>{OrderImported.notes}</p>
            </div>
          }
          {/* attachments */}
          <div className='flex flex-col space-y-2'>
            {/* title and button to add files */}
            <div className='flex flex-row justify-between items-center'>
              {/* logo and title */}
              <div className='flex flex-row space-x-4'>
                <p>logo</p>
                <p>Adjuntos</p>
              </div>
              {/* button to add files */}
              <button>
                <div className='flex flex-row space-x-4'>
                  <p>Añadir archivo</p>
                  <p>+</p>
                </div>
              </button>
            </div>
            RESULTADOS AÑADIDOS
          </div>
        </div>
      </div>

    </div>
  );
}


export default OrderImported;