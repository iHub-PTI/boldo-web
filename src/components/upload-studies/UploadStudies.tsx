import React, { useState } from 'react';
import SearchIcon from './SearchIcon';
import PlusIcon from './PlusIcon';
import BackIcon from './BackIcon';
import TableOfStudies from './TableOfStudies';


type Props = {

}


const UploadStudies = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)
  const [showNewStudyWithOutOrder, setShowNewStudyWithOutOrder] = useState<boolean>(true)
  const [showTable, setShowTAble] = useState<boolean>(false)
  
  // This function handles the visibility of the back button
  const handleShowNewStudyWithOutOrder = () => {
    setShowNewStudyWithOutOrder(!showNewStudyWithOutOrder)
  }
  
  // this function handles the visibilitu of the table
  const handleShowTable = (show: boolean) => {
    setShowTAble(show)
  }


  return (
    // container for all the upload studies section
    <div className='flex flex-col justify-between h-full w-full'>
      {/* header and body */}
      <div className='flex flex-col items-center'>
        {/* this only show when new study is clicked */}
        <button 
          className={`flex flex-row ml-6 mt-2 w-full focus:outline-none ${showNewStudyWithOutOrder ? 'invisible' : 'visible'}`}
          onClick={() => {
            handleShowNewStudyWithOutOrder()
            setShowTAble(true)
          }}
        >
          <BackIcon />
          <p 
            className='not-italic font-sans font-normal text-base leading-6' 
            style={{color: '#27BEC2'}}
          >
            atrás
          </p>
        </button>
        {/* principal header */}
        <div className='w-full'>
          <p className='w-full not-italic font-sans font-bold text-xl leading-6 ml-6 mb-6 mt-2'>
            Añadir resultado de estudio
          </p>
        </div>
        {/* secondary header */}
        <p className='not-italic font-sans font-normal text-xl leading-6 m-6'>Busque una orden o adjunte un nuevo estudio</p>
        {/* bar for search studies for order number */}
        <div 
          className='flex flex-row pt-1 pb-1 w-2/3 rounded-lg hover:bg-gray-200 transition duration-300'
          onClick={() => handleShowTable(true)}
        >
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
        {/* It is only shown when we want to associate it with an order */}
        { showNewStudyWithOutOrder &&
          <button 
            className='flex flex-row mt-4 mb-2 pt-1 pb-1 w-2/3 focus:outline-none rounded-lg hover:bg-gray-100 transition duration-300'
            onClick={() => {
              handleShowNewStudyWithOutOrder()
              setShowTAble(false)
            }}
          >
            <PlusIcon />
            <p 
              className='not-italic font-sans font-normal text-base leading-6' 
              style={{color: '#27BEC2'}}
            >
              Adjuntar nuevo estudio sin orden
            </p>
          </button>
        }
        { showTable &&
          <TableOfStudies />
        }
      </div>
      {/* footer */}

    </div>
  );
}


export default UploadStudies;