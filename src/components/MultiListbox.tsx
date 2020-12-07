import React, { useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'

type Props = {
  data: { value: string; name: string }[]
  label?: string
  value?: string[]
  drawLine?: number[]
  onChange?: (value: string[]) => void
}

const MultiListboxComponent: React.FC<Props> = ({ data, label, value, onChange, drawLine }) => {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (value) setSelected(value)
  }, [value])

  return (
    <Listbox
      as='div'
      className='space-y-1'
      value={selected}
      onChange={(value: any) => {
        const newList = selected.includes(value) ? selected.filter(val => val !== value) : [...selected, value]
        setSelected(newList)
        if (onChange) onChange(newList)
      }}
    >
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className='block text-sm font-medium leading-5 text-gray-700'>{label}</Listbox.Label>
          )}
          <div className='relative'>
            <span className='inline-block w-full rounded-md shadow-sm'>
              <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'>
                <div>
                  {selected.length
                    ? selected.map(selectedValue => (
                        <span
                          key={selectedValue}
                          className='m-1 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800'
                        >
                          {data.find(el => el.value === selectedValue)?.name || selectedValue}
                        </span>
                      ))
                    : 'Seleccione un valor'}
                </div>
                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <svg className='w-5 h-5 text-gray-400' viewBox='0 0 20 20' fill='none' stroke='currentColor'>
                    <path
                      d='M7 7l3-3 3 3m0 6l-3 3-3-3'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </Listbox.Button>
            </span>

            <Transition
              show={open}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
              className='absolute w-full mt-1 bg-white rounded-md shadow-lg'
            >
              <Listbox.Options
                static
                className='py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-56 focus:outline-none sm:text-sm sm:leading-5'
              >
                {data.map((item, i) => (
                  <Listbox.Option key={item.value} value={item.value}>
                    {({ active }) => (
                      <>
                        <div
                          className={`${
                            active ? 'text-white bg-blue-600' : 'text-gray-900'
                          } cursor-default select-none relative py-2 pl-8 pr-4`}
                        >
                          <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                            {item.name}
                          </span>
                          {selected.includes(item.value) && (
                            <span
                              className={`${
                                active ? 'text-white' : 'text-blue-600'
                              } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                            >
                              <svg
                                className='w-5 h-5'
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                        {drawLine?.includes(i) && <hr className='my-2' />}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
export default MultiListboxComponent
