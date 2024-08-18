import React from 'react';
import { toUpperLowerCase } from '../../util/helpers';


type Props = {
  doctor: any,
  className: string;
}


const DoctorName = (props: Props) => {
  const {doctor, className=''} = props

  return(
    <p className={className}>
      { doctor?.gender &&
        doctor.gender === 'female'
          ? 'Dra. '
          : doctor.gender === 'male'
            ? 'Dr. '
            : ''
      }
      {
        doctor?.first_name && toUpperLowerCase(doctor.first_name.split(' ')[0]) + ' '
      }
      {
        doctor?.last_name && toUpperLowerCase(doctor.last_name.split(' ')[0])
      }
    </p>
  );
}


export default DoctorName;