import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '../icons/upload-icons/SearchIcon';
import PlusIcon from '../icons/upload-icons/PlusIcon';
import BackIcon from '../icons/upload-icons/BackIcon';
import TableOfStudies from './TableOfStudies';
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, ORGANIZATION_BAR, WIDTH_XL } from '../../util/constants';
import useWindowDimensions from "../../util/useWindowDimensions";
import OrderImported from './OrderImported';
import LockIcon from '../icons/upload-icons/LockIcon';


type Props = {
  patientId: string
}


const UploadStudies = (props: Props) => {
  const {patientId} = props
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)
  const [showNewStudyWithOutOrder, setShowNewStudyWithOutOrder] = useState<boolean>(true)
  const [showTable, setShowTable] = useState<boolean>(false)
  const [showOrderImported, setShowOrderImported] = useState<boolean>(false)
  const saveButtonRef = useRef<HTMLButtonElement>(null)
  const { width } = useWindowDimensions()
  
  // This function handles the visibility of the back button
  const handleShowNewStudyWithOutOrder = () => {
    setShowNewStudyWithOutOrder(!showNewStudyWithOutOrder)
  }
  
  // this function handles the visibilitu of the table
  const handleShowTable = (show: boolean) => {
    if (show) setShowOrderImported(false)
    setShowTable(show)
  }

  useEffect(() => {
    if (showOrderImported) setShowTable(false)
  }, [showOrderImported])


  return (
    // container for all the upload studies section
    <div 
      className='flex flex-col justify-between overflow-auto scrollbar'
      style={{
        height: ` ${width >= WIDTH_XL
          ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
          : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
        }`,
      }}
    >
      {/* header and body */}
      <div className={`flex flex-col overflow-auto scrollbar ${width >= WIDTH_XL ? 'h-11/12' : 'h-10/12' }`}>
        {/* this only show when new study is clicked */}
        <button 
          className={`flex flex-row ml-6 mt-2 w-auto focus:outline-none ${showNewStudyWithOutOrder ? 'invisible' : 'visible'}`}
          onClick={() => {
            handleShowNewStudyWithOutOrder()
            setShowTable(true)
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
        <div className='flex flex-col items-center'>
          {/* principal header */}
          <div className='w-full'>
            <p className='w-auto not-italic font-sans font-bold text-xl leading-6 ml-6 mb-2 mt-2'>
              Añadir resultado de estudio
            </p>
          </div>
          {/* secondary header */}
          <p className='not-italic font-sans font-normal text-xl leading-6 m-4'>Busque una orden o adjunte un nuevo estudio</p>
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
                setShowTable(false)
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
            <div style={{width: "95%"}}>
              <TableOfStudies patientId={patientId} handleShowOrderImported={() => setShowOrderImported(!showOrderImported)} />
            </div>
          }
          { showOrderImported &&
            <div style={{width: "95%"}}>
              <OrderImported handleShowOrderImported={() => setShowOrderImported(!showOrderImported)} saveRef={saveButtonRef} />
            </div>
          }
        </div>
      </div>
      {/* footer */}
      <div className='flex flex-row items-center justify-end pr-6 pb-6 h-1/12'>
        <button
          className='focus:outline-none rounded-lg bg-teal-400 p-2'
          // the onClick is handle in other component
          ref={saveButtonRef}
        >
          <div className='flex flex-row space-x-2'>
            <p className='text-white'>Guardar</p>
            <LockIcon />
          </div>
        </button>
      </div>
    </div>
  );
}


export default UploadStudies;