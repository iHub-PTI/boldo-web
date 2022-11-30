import React from 'react';
import { ReactComponent as Close } from '../../assets/close-orange.svg';
import { ReactComponent as TimeSlot } from '../../assets/time-slot.svg';
import { ReactComponent as Check } from '../../assets/check-small.svg';
import { ReactComponent as VirtualIcon } from '../../assets/virtual-appointment.svg';
import { ReactComponent as PresentialIcon } from '../../assets/presential-appointment.svg';
import { ReactComponent as CancelVirtualIcon } from '../../assets/cancel-virtual-appointment.svg';
import { ReactComponent as CancelPresentialIcon } from '../../assets/cancel-presential-appointment.svg';


function AppointmentCard(eventInfo) {
  return (
    /* this sentence is very important for prevent bug what show event at 07 o'clock*/
    eventInfo.timeText !== "" 
      ? <div className="card-container">
        <div className="header-container">
          {
            eventInfo.event.extendedProps.status === 'cancelled'
              ? <Close /> 
              : eventInfo.event.extendedProps.status === 'locked'
                ? <Check />
                : <TimeSlot />
          }
        </div>
      </div>
      : null
  );
}


export default AppointmentCard;