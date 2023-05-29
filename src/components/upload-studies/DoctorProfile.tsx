import React from 'react';
import NoProfilePicture from '../icons/NoProfilePicture';
import DoctorName from './DoctorName';


type Props = {
  doctor: iHub.Doctor;
  organization?: Boldo.OrganizationInOrderStudy
}


const DoctorProfile = (props: Props) => {
  const {doctor={} as iHub.Doctor, organization=undefined} = props

  return(
    <div className='flex flex-col space-y-2'>
      {/* text */}
      <p className='font-semibold text-xs not-italic leading-4 text-gray-500'>Orden</p>
      {/* photo and description */}
      <div className='flex flex-row space-x-4'>
        { doctor?.photoUrl !== undefined
          ? <img
              src={doctor.photoUrl}
              alt='Foto de Perfil'
              className='flex-none border-1 border-white w-11 h-11 rounded-full object-cover'
            />
          : <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-11 h-11' />
        }
        {/* name and description */}
        <div className='flex flex-col'>
          {/* prefix and name */}
          <DoctorName doctor={doctor} className='font-normal text-base not-italic leading-6 text-gray-700' />
          {/* description */}
          <div className='flex flex-row items-center space-x-1'>
            {/* specialty */}
            <p className='font-normal text-xs not-italic leading-4 text-gray-600'>Cardiólogo</p>
            {/* circle */}
            {organization && <div className="h-2 w-2 rounded-full bg-gray-500"></div>}
            {/* Hospital */}
            {organization && <p className='font-normal text-xs not-italic leading-4 text-gray-600'>{organization?.name ?? 'Sin nombre'}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}


export default DoctorProfile;