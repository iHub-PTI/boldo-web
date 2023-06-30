import { Listbox, Transition } from '@headlessui/react'
import React from 'react'
import ArrowDown from '../icons/ArrowDown';
import ArrowUp from '../icons/ArrowUp';

export type Item = {
  value: string;
  name: string;
  icon?: React.FunctionComponent | JSX.Element
}

type Props = {
  data: Item[];
  selectedValue: Item;
  setSelectedValue: (value) => void;
  // name of the element with your respective icon
  label?: string;
}

const ListboxCustom = (props: Props) => {
  const { data, selectedValue, setSelectedValue, label } = props

  return (
    <Listbox value={selectedValue} onChange={setSelectedValue}>
      {({open}) => (
        <>
          <div className='flex flex-col w-full space-y-2'>
            { label &&
              <Listbox.Label className='block not-italic font-medium text-base leading-6 text-gray-700' >{label}</Listbox.Label>
            }
            <div className='relative'>
              <Listbox.Button className='flex relative w-full items-center justify-center px-4 py-2 gap-4 bg-white rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none'>
                {/* all the component */}
                <div className='w-full flex flex-row justify-between items-center'>
                  {/* icon and name */}
                  {
                    <div className='flex flex-row space-x-2'>
                      {/* icon */}
                      { selectedValue?.icon &&
                        <div className='flex items-center'>{selectedValue.icon}</div>
                      }
                      {/* name of the category */}
                      <p className='flex items-center not-italic font-medium text-base leading-6 text-gray-600'>{selectedValue.name}</p>
                    </div>
                  }
                  {/* dropdown icon */}
                  {open ? <ArrowUp fill='#364152' fillOpacity='1' /> : <ArrowDown fill='#364152' fillOpacity='1' />}
                </div>
              </Listbox.Button>
              <Transition
                show={open}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
                className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg'
              >
                <Listbox.Options
                  static
                  className='py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5'
                >
                  {
                    data.filter((item) => item.value !== '').map((item, index) => (
                      <Listbox.Option key={index} value={item}>
                        {({selected, active}) => (
                          <div className='flex flex-row items-center space-x-2 p-2 hover:bg-gray-100'>
                            {item.icon}
                            <p className='not-italic font-medium text-base leading-6 text-gray-600'>{item.name}</p>
                          </div>
                        )}
                      </Listbox.Option>
                    ))
                  }
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default ListboxCustom