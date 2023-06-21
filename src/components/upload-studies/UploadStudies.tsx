import React, { useCallback, useEffect, useState, useRef } from 'react';
import SearchIcon from '../icons/upload-icons/SearchIcon';
import PlusIcon from '../icons/upload-icons/PlusIcon';
import BackIcon from '../icons/upload-icons/BackIcon';
import TableOfStudies from './TableOfStudies';
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, ORGANIZATION_BAR, WIDTH_XL } from '../../util/constants';
import useWindowDimensions from "../../util/useWindowDimensions";
import OrderImported from './OrderImported';
import _ from 'lodash';
import LockIcon from '../icons/upload-icons/LockIcon';
import LoadingSpinner from '../icons/sumary-print/LoadingSpinner';
import StudyForm from './StudyForm';


type Props = {
  patientId: string
}


const UploadStudies = (props: Props) => {
  const { patientId } = props
  const [searchValue, setSearchValue] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchError, setSearchError] = useState<boolean>(false)
  const [showNewStudyWithOrder, setShowNewStudyWithOrder] = useState<boolean>(true)
  const [showNewStudyWithoutOrder, setShowNewStudyWithoutOrder] = useState<boolean>(false)
  const [showTable, setShowTable] = useState<boolean>(false)
  const [showOrderImported, setShowOrderImported] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const saveButtonRef = useRef<HTMLButtonElement>(null)
  const inputButtonRef = useRef<HTMLInputElement>(null)
  const { width } = useWindowDimensions()

  // This function handles the visibility of the back button
  const handleShowNewStudyWithOutOrder = () => {
    setShowNewStudyWithOrder(!showNewStudyWithOrder)
    if (showOrderImported) setShowOrderImported(false)
    if (showNewStudyWithoutOrder) setShowNewStudyWithoutOrder(false)
  }

  // this function handles the visibilitu of the table
  const handleShowTable = (show: boolean) => {
    if (show) setShowOrderImported(false)
    setShowTable(show)
  }

  useEffect(() => {
    if (showOrderImported) setShowNewStudyWithOrder(false)
  }, [showOrderImported])

  //debounce input 
  const handleChangeInputNumberOrder = useCallback(
    _.debounce(value => {
      setSearchValue(value)
      console.log('llamado')
    }, 1000),
    []
  )

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
          className={`flex flex-row ml-6 mt-1 w-auto focus:outline-none ${showNewStudyWithOrder ? 'invisible' : 'visible'}`}
          onClick={() => {
            handleShowNewStudyWithOutOrder()
            setShowTable(true)
          }}
        >
          <BackIcon />
          <p
            className='not-italic font-sans font-normal text-base leading-6'
            style={{ color: '#27BEC2' }}
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
          <p className='not-italic font-sans font-normal text-xl leading-6 m-2'>Busque una orden o adjunte un nuevo estudio</p>
          {/* bar for search studies for order number */}
          <div
            className='flex flex-row pt-1 pb-1 w-2/3 rounded-lg hover:bg-gray-200 transition duration-300'
            onClick={() => {
              handleShowTable(true)
              setShowNewStudyWithoutOrder(false)
              setShowNewStudyWithOrder(true)
            }}
          >
            <SearchIcon />
            <input
              ref={inputButtonRef}
              id='searchStudy'
              type='text'
              className='flex flex-grow bg-transparent focus:outline-none text-gray-500'
              placeholder='Haga click para desplegar el listado o coloque el número de orden'
              onChange={event => handleChangeInputNumberOrder(event.target.value)}
              disabled={searchError}
            />
          </div>
          {/* It is only shown when we want to associate it with an order */}
          {showNewStudyWithOrder &&
            <button
              className='flex flex-row mt-2 mb-2 pt-1 pb-1 w-2/3 focus:outline-none rounded-lg hover:bg-gray-100 transition duration-300'
              onClick={() => {
                handleShowNewStudyWithOutOrder()
                setShowNewStudyWithoutOrder(true)
                setShowTable(false)
              }}
            >
              <PlusIcon />
              <p
                className='not-italic font-sans font-normal text-base leading-6'
                style={{ color: '#27BEC2' }}
              >
                Adjuntar nuevo estudio sin orden
              </p>
            </button>
          }
          {showTable &&
            <div style={{ width: "95%" }}>
              <TableOfStudies patientId={patientId} searchByOrder={searchValue} handleShowOrderImported={() => setShowOrderImported(!showOrderImported)} />
            </div>
          }
          { showOrderImported &&
            <div style={{width: "95%"}}>
              <OrderImported
                searchRef={inputButtonRef}
                setLoadingSubmit={setLoadingSubmit}
                handleShowOrderImported={() => setShowOrderImported(!showOrderImported)}
                saveRef={saveButtonRef}
              />
            </div>
          }
          { showNewStudyWithoutOrder &&
            <div style={{width: "95%"}}>
              <StudyForm saveRef={saveButtonRef} patientId={patientId} setLoadingSubmit={setLoadingSubmit} />
            </div>
          }
        </div>
      </div>
      {/* footer */}
      <div className='flex flex-row items-center justify-end pr-6 pb-6 h-1/12'>
        <button
          className={`focus:outline-none rounded-lg bg-teal-400 p-2 ${loadingSubmit ? 'cursor-not-allowed' : ''}`}
          // the onClick is handle in other component
          ref={saveButtonRef}
          disabled={loadingSubmit}
        >
          <div className='flex flex-row space-x-2'>
            <p className='text-white'>Guardar</p>
            { loadingSubmit
                ? <LoadingSpinner />
                : <LockIcon />
            }
          </div>
        </button>
      </div>
    </div>
  );
}


export default UploadStudies;