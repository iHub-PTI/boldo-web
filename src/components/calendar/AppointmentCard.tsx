import React from 'react';
import { ReactComponent as Close } from '../../assets/close-orange.svg';
import { ReactComponent as TimeSlot } from '../../assets/time-slot.svg';
import { ReactComponent as Check } from '../../assets/check-small.svg';
import { ReactComponent as VirtualIcon } from '../../assets/virtual-appointment.svg';
import { ReactComponent as NowVirtualIcon } from '../../assets/now-virtual-appointment.svg';
import { ReactComponent as PresentialIcon } from '../../assets/presential-appointment.svg';
import { ReactComponent as LockPresentialIcon } from '../../assets/lock-presential-appointment.svg';
import { ReactComponent as CancelVirtualIcon } from '../../assets/cancel-virtual-appointment.svg';
import { ReactComponent as CancelPresentialIcon } from '../../assets/cancel-presential-appointment.svg';
import { ReactComponent as Now } from '../../assets/now.svg';


function AppointmentCard(eventInfo) {
  return (
    /* this sentence is very important for prevent bug what show event at 07 o'clock*/
    eventInfo.timeText !== "" 
      ? <div className="card-container">
        {/* header of the container */}
        <div className="flex">
          {
            eventInfo.event.extendedProps.status === 'cancelled'
              ? <div className='mt-1 ml-1 mr-1'><Close /></div> 
              : eventInfo.event.extendedProps.status === 'open' 
                ? <div className='mt-1 ml-1 mr-1'><Now /></div> 
                : eventInfo.event.extendedProps.status === 'locked'
                  ? <div className='mt-1 ml-1 mr-1'><Check /></div>
                  : <div className='mt-1 ml-1 mr-1'><TimeSlot /></div>
          }
          {
            eventInfo.event.extendedProps.status === 'cancelled'
              ? <p className="ml-1 text-orange-600">Cita cancelada</p> 
              : eventInfo.event.extendedProps.status === 'open' 
                ? <p className="ml-1 text-orange-600">Cita accesible</p>
                : eventInfo.event.extendedProps.status === 'locked'
                  ? <p className="ml-1 text-teal-400">Cita atendida</p>
                  : <p className='ml-1'>{eventInfo.timeText}</p>
          }
        </div>
        {/* name of the patient */}
        <div className="flex mt-1">
          <p className="ml-1 font-medium">{eventInfo.event.extendedProps.patient.givenName.split(' ')[0]}</p>
          <p className="ml-1 font-medium">{eventInfo.event.extendedProps.patient.familyName.split(' ')[0]}</p>
        </div>
        {/* icon */}
        <div>
          {
            eventInfo.event.extendedProps.status === 'cancelled'
              ? eventInfo.event.extendedProps.appointmentType === 'V'
                ? <div className='mt-1 ml-1 mr-1'><CancelVirtualIcon /></div> 
                : <div className='mt-1 ml-1 mr-1'><CancelPresentialIcon /></div> 
              : eventInfo.event.extendedProps.appointmentType === 'V'
                ? eventInfo.event.extendedProps.status === 'open'
                  ? <div className='mt-1 ml-1 mr-1'><NowVirtualIcon /></div>
                  : <div className='mt-1 ml-1 mr-1'><VirtualIcon /></div>
                : eventInfo.event.extendedProps.status === 'locked'
                  ? <div className='mt-1 ml-1 mr-1'><LockPresentialIcon /></div>
                  : <div className='mt-1 ml-1 mr-1'><PresentialIcon /></div>
          }
        </div>
      </div>
      : null
  );
}


export default AppointmentCard;