import React, { useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'

type Props = {
  data: { id: string; name: string; colorCode: string }[]
  label?: string
  id?: string
  onChange?: (value: string) => void
}

const ListboxComponent: React.FC<Props> = ({ data, label, id, onChange }) => {
  const [selected, setSelected] = useState(id || data[0].id)

  useEffect(() => {
    if (id) setSelected(id)
  }, [id])

  return (
    <Listbox
      as='div'
      className='space-y-1'
      value={selected}
      onChange={(value: any) => {
        setSelected(value)
        if (onChange) onChange(value)
      }}
    >
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className='block text-sm font-medium leading-5 text-gray-700'>{label}</Listbox.Label>
          )}
          <div className='relative'>
            <span className='inline-block w-full rounded-md shadow-sm'>
              <Listbox.Button className='relative w-full py-2 pl-8 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none'>
                <span className='block truncate font-semibold' title={data.find(item => item.id === selected)?.name}>
                  {data.find(item => item.id === selected)?.name}
                </span>
                <div className={`absolute inset-y-0 left-0 flex items-center pl-1.5 ml-1`}>
                  <div
                    className='h-4 w-2'
                    style={{ backgroundColor: data.find(item => item.id === selected)?.colorCode }}
                  ></div>
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
              className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg'
            >
              <Listbox.Options
                static
                className='py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5'
              >
                {data.map(item => (
                  <Listbox.Option key={item.id} value={item.id}>
                    {({ selected, active }) => (
                      <div className={`cursor-default select-none relative py-2 pl-8 pr-4 hover:bg-gray-100`}>
                        <span
                          className={`${selected ? 'font-semibold text-primary-500' : 'font-semibold'} block truncate`}
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-1.5 ml-1`}>
                          <div className='h-4 w-2' style={{ backgroundColor: item.colorCode }}></div>
                        </div>
                      </div>
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
export default ListboxComponent
