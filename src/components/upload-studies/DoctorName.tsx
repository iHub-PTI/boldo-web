import React from 'react';
import { toUpperLowerCase } from '../../util/helpers';


type Props = {
  doctor: iHub.Doctor;
  className: string;
}


const DoctorName = (props: Props) => {
  const {doctor={} as iHub.Doctor, className=''} = props

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
        doctor?.givenName && toUpperLowerCase(doctor.givenName.split(' ')[0]) + ' '
      }
      {
        doctor?.familyName && toUpperLowerCase(doctor.familyName.split(' ')[0])
      }
    </p>
  );
}


export default DoctorName;