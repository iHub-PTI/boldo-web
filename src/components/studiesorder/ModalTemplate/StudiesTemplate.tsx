import React, { useState } from 'react'
import Modal from '../../Modal'
import { ReactComponent as CloseIcon } from '../../../assets/close.svg'
import {ReactComponent as AddIcon } from '../../../assets/rounded-add.svg'
import { PaginationTemplate } from './PaginationTemplate'

export const StudiesTemplate = ({ show, setShow, ...props }) => {
  const datas = ['Predeterminado', 'Pancreatitis', 'Checkeo Anual', 'Template1', 'Template2', 'Template3', 'Template4']
  const [template, setTemplate] = useState('Predeterminado')
  const [page, setPage] = useState(1)
  const perPage = 3
  const maxPagination = Math.ceil(datas.length / perPage)

  return (
    <Modal show={show} setShow={setShow} size='full' {...props}>
      <div className='relative'>
        <h5 className='text-2xl font-normal leading-normal mt-0 pt-0 mb-2'>
          Plantillas: Orden de estudios laboratoriales
        </h5>
        <button className='absolute focus:outline-none top-0 right-0' onClick={() => setShow(false)}>
          <CloseIcon></CloseIcon>
        </button>
      </div>
      <div className='flex flex-row'>
        <div className='flex w-full'>
          {datas.slice((page - 1) * perPage, (page - 1) * perPage + perPage).map((data, i) => (
            <div
              key={i}
              className={`flex flex-row justify-center border-b-2 ${
                data === template ? 'border-primary-600' : 'border-gray-300'
              }`}
              style={{ width: '100%', maxWidth: '12rem', height: '3rem' }}
            >
              <button
                className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${
                  data === template ? 'text-primary-600' : 'text-gray-400'
                }`}
                onClick={() => {
                  setTemplate(data)
                }}
              >
                {data}
              </button>
            </div>
          ))}
        </div>
        <PaginationTemplate page={page} setPage={setPage} maxPagination={maxPagination}></PaginationTemplate>
        <button className="focus:outline-none ml-10">
          <AddIcon></AddIcon>
        </button>
      </div>
    </Modal>
  )
}
