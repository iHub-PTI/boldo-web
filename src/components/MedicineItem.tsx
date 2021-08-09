import React from 'react'

export default function MedicineItem({
  changeDescriptionCallback,
  medicine,
  deleteMedicineCallback,
}: {
  changeDescriptionCallback: any
  deleteMedicineCallback: any
  medicine: any
}) {
  return (
    <div className='flex justify-center w-full mt-3 mb-4'>
      <div className='flex flex-col w-full'>
        <p className='block text-xs font-medium leading-5 text-gray-700'>{medicine.name}</p>
        <div className='w-full mt-1'>
          <label htmlFor={`Indicationes${medicine.id}}`} className='block text-xs leading-5 text-gray-600'>
            Indicationes
          </label>

          <div className='w-full rounded-md shadow-sm'>
            <textarea
              id={`Indicationes${medicine.id}}`}
              rows={2}
              className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-xs sm:leading-5'
              placeholder=''
              onChange={e => changeDescriptionCallback(e.target.value)}
              value={medicine.indications ? medicine.indications : ''}
            />
          </div>
        </div>
      </div>
      <svg
        onClick={() => {
          deleteMedicineCallback()
        }}
        xmlns='http://www.w3.org/2000/svg'
        className='w-6 h-6 text-red-700 cursor-pointer'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
        />
      </svg>
    </div>
  )
}
