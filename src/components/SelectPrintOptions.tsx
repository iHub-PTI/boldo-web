import React from 'react'
import { Popover, Transition } from '@headlessui/react'
import Print from './icons/Print'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core'


const SelectPrintOptions = () => {

  // space bewteen button and tooltip
  const useTooltipStyles = makeStyles(() => ({
    tooltip: {
      margin: 5,
    },
  }))

  return (
    // infor about button
    <Tooltip
      title={<h1 style={{ fontSize: 14 }}>Impresión de informes</h1>}
      placement='left'
      leaveDelay={100} // time in miliseconds
      classes={useTooltipStyles()}
    >
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button className='focus:outline-none relative'>
              <Print
                bgColor='#27BEC2'
                iconColor='#FFFFFF'
                fromVirtual={false}
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
                className="absolute transform -translate-y-1/2 translate-x-20 w-56 h-72 p-4 rounded-2xl shadow-xl bg-white"
              >
                {/* popover container */}
                <div className='flex flex-col justify-between '>
                  <span className='pb-5'>Imprimir informe</span>
                  {/* list of options */}
                  <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-row gap-4'>Receta</div>
                    <div className='flex flex-row gap-4'>Estudios</div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </Tooltip>
  )
}


export default SelectPrintOptions