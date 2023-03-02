import React, { useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import Print from './icons/Print'
import PrescriptionSelect from './icons/sumary-print/PrescriptionSelect'
import StudiesSelect from './icons/sumary-print/StudiesSelect'
import CheckWithoutBackground from './icons/sumary-print/CheckWithoutBackground'
import LoadingSpinner from './icons/sumary-print/LoadingSpinner'



// ********************* PRINCIPAL FUNCTION *********************
const SelectPrintOptions = () => {
  // ********************* list of variables *********************
  // to handle popover state
  const [prescriptionsSelected, setPrescriptionsSelected] = useState<boolean>(false)
  const [studiesSelected, setStudiesSelected] = useState<boolean>(false)
  const [loadReports, setLoadReports] = useState<boolean>(false)
  // variable to show selected or unselected color on text and icon
  const colors = {
    selected: "#24AAAD",
    unselected: "#364152"
  }
  // variable to show selected or unselected color on background
  const backgroundColors = {
    selected: "#F8FFFF",
    unselected: ""
  }


  // ********************* list of functions *********************
  // function that waits for the state and returns the color
  const getColor = (state: boolean):string => {
    return state ? colors.selected : colors.unselected
  }
  // function that waits for the state and returns the background color
  const getBackColor = (state: boolean):string => {
    return state ? backgroundColors.selected : backgroundColors.unselected
  }
  // function to change the prescription selected state
  const handlePrescriptions = () => setPrescriptionsSelected(!prescriptionsSelected)
  // function to change the study selected state
  const handleStudies = () => setStudiesSelected(!studiesSelected)


  return (
    // infor about button
    <Popover className='relative'>
      {({ open }) => (
        <>
          <Popover.Button className='focus:outline-none relative'>
            <Print
              bgColor='#27BEC2'
              iconColor='#FFFFFF'
            />
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            // fixed and z-50 allow the component to be displayed on top of the rest
            enterTo="transform scale-100 opacity-100 fixed z-50"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel 
              className="absolute transform -translate-y-full translate-x-20 w-56 h-64 p-4 rounded-2xl shadow-xl bg-white"
            >
              {/* popover container */}
              <div className='flex flex-col justify-between h-full'>
                <div className='flex flex-col'>
                  <span className='pb-5'>Imprimir informe</span>
                  {/* list of options */}
                  <div className='flex flex-col gap-1 w-full'>
                    {/* PRESCRIPTIONS BUTTON */}
                    <button 
                      className={`flex flex-row gap-4 h-11 items-center rounded ${prescriptionsSelected ? '' : 'hover:bg-gray-100' } focus:outline-none`}
                      style={{backgroundColor: `${getBackColor(prescriptionsSelected)}`}}
                      onClick={handlePrescriptions}
                    >
                      <PrescriptionSelect 
                        currentColor={getColor(prescriptionsSelected)}
                      />
                      <span
                        style={{color: getColor(prescriptionsSelected)}}
                      >
                        Receta
                      </span>
                    </button>
                    {/* STUDIES BUTTON */}
                    <button 
                      className={`flex flex-row gap-4 h-11 items-center rounded ${studiesSelected ? '' : 'hover:bg-gray-100' } focus:outline-none`}
                      style={{backgroundColor: `${getBackColor(studiesSelected)}`}}
                      onClick={handleStudies}
                    >
                      <StudiesSelect 
                        currentColor={getColor(studiesSelected)}
                      />
                      <span
                        style={{color: getColor(studiesSelected)}}
                      >
                        Órdenes
                      </span>
                    </button>
                  </div>
                </div>
                <button 
                  className='flex flex-row flex-wrap gap-2 self-end p-2 rounded-lg focus:outline-none'
                  style={{ backgroundColor: colors.selected }}
                >
                  <span className='text-white'>Confirmar</span>
                  {loadReports ? <LoadingSpinner /> : <CheckWithoutBackground /> }
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}


export default SelectPrintOptions