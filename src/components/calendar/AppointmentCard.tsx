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
import { ReactComponent as NowTeal } from '../../assets/now-white.svg';


function AppointmentCard(eventInfo) {

  let borderColor = 'red';

  // this functions get the time in format HH:MM
  function getTime(timeString) {
    let date = new Date(timeString);

    return (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
  }

  return (
    /* timeText is very important for prevent bug what show event at 07 o'clock*/
    /* dont show PrivateEvent */
    eventInfo.timeText !== "" && eventInfo.event.extendedProps.type !== "PrivateEvent"
      ? <div 
          className={
            `h-full w-full rounded-r-3xl hover:shadow-outline-gray overflow-hidden ...`}
          style={{ borderLeftWidth: '2px', borderLeftColor: borderColor }}  
        >
        {/* header of the container */}
        {console.log("elementos ", eventInfo.event.extendedProps)}
        <div className="flex">
          { 
            eventInfo.event.extendedProps.status === 'cancelled'
              ? <div className='mt-1 ml-1 mr-1'><Close /></div> 
              : eventInfo.event.extendedProps.status === 'locked'
                ? <div className='mt-1 ml-1 mr-1'><Check /></div>
                : eventInfo.event.extendedProps.status === 'upcoming' || eventInfo.event.extendedProps.status === 'closed'
                  ? <div className='mt-1 ml-1 mr-1'><TimeSlot /></div>
                  // : eventInfo.event.extendedProps.status === 'open'
                  : <div className='mt-1 ml-1 mr-1'><Now /></div> 
          }
          {
            eventInfo.event.extendedProps.status === 'cancelled'
            ? <p className="ml-1 text-orange-600">Cita cancelada</p> 
            : eventInfo.event.extendedProps.status === 'locked'
              ? <p className="ml-1 text-teal-400">Cita atendida</p>
              : eventInfo.event.extendedProps.status === 'upcoming' || eventInfo.event.extendedProps.status === 'closed'
                ? <p className='ml-1'>{eventInfo.timeText}</p>
                // : eventInfo.event.extendedProps.status === 'open'
                : <p className="ml-1 text-orange-600">Cita abierta</p> 
          }
        </div>
        <div className='flex'>
          { eventInfo.event.extendedProps.patient.photoUrl && 
            <div className='content-center justify-items-center'>
              <img
                className='object-cover w-12 h-12 sm:h-8 md:h-12 lg:h-12 xl:h-12 rounded-full mt-2 ml-1 mr-1 ...'
                src={eventInfo.event.extendedProps.patient.photoUrl}
                alt='Foto de perfil del paciente' 
              />
            </div>
          }
          <div>
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
        </div>
      </div>
      : eventInfo.event.extendedProps.type === "PrivateEvent"
        ? <div 
          className="h-full w-ful rounded-r-3xl bg-teal-400 hover:bg-teal-500 ..."
          style={{ borderLeftWidth: '2px', borderLeftColor: borderColor }} 
        >
          {/* header of the container */}
          <div className="flex">
            <div className='mt-1 ml-1 mr-1'><NowTeal /></div>
            <p className="font-medium ml-1 text-white">
              {getTime(eventInfo.event.startStr)}-{getTime(eventInfo.event.endStr)}
              {console.log(eventInfo.event)}
            </p> 
          </div>
          {/* name and description of the event */}
          <div className="mt-1 ml-1">
            <p className="text-white">
              {eventInfo.event.extendedProps.name ?? 'Evento Privado'} 
            </p>
            <p className="text-white">
              {eventInfo.event.extendedProps.description ?? 'Descripción vacía'}
            </p>
          </div>
        </div>
        : null
  );
}


export default AppointmentCard;