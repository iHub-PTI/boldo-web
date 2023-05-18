import React from 'react';
import { toUpperLowerCase } from '../../util/helpers';


type Props = {
  doctor: iHub.Doctor;
}


const DoctorName = (props: Props) => {
  const {doctor} = props

  return(
    <p className='not-italic font-normal text-sm leading-6 text-gray-700'>
      { doctor?.gender &&
        doctor.gender === 'female'
          ? 'Dra. '
          : doctor.gender === 'male'
            ? 'Dr. '
            : ''
      }
      {
        toUpperLowerCase(doctor.familyName.split(' ')[0]) + ' '
      }
      {
        toUpperLowerCase(doctor.givenName.split(' ')[0])
      }
    </p>
  );
}


export default DoctorName;