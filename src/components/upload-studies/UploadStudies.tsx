import React, { useState } from 'react';
import SearchIcon from './SearchIcon';


type Props = {

}


const UploadStudies = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)
  

  return (
    // container for all the upload studies section
    <div className='flex flex-col justify-between h-full w-full'>
      {/* header and body */}
      <div className='flex flex-col items-center'>
        <div className='w-full'>
          <p className='w-full not-italic font-sans font-bold text-xl leading-6 m-6'>
            Añadir resultado de estudio
          </p>
        </div>
        <p className='not-italic font-sans font-normal text-xl leading-6 m-6'>Busque una orden o adjunte un nuevo estudio</p>
        <div className='flex flex-row pt-1 pb-1 w-2/3 rounded-lg hover:bg-gray-200 transition duration-300'>
          <SearchIcon />
          <input 
            id='searchStudy'
            type='text'
            className='flex flex-grow bg-transparent focus:outline-none text-gray-500'
            placeholder='Haga click para desplegar el listado o coloque el número de orden'
            onChange={event => setSearchValue(event.target.value)}
            value={searchValue}
            disabled={searchError}
          />
        </div>
      </div>
      {/* footer */}

    </div>
  );
}


export default UploadStudies;