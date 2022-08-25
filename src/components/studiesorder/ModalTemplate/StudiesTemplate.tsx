import React, { useState, useContext, useEffect } from 'react'
import Modal from '../../Modal'
import { ReactComponent as CloseIcon } from '../../../assets/close.svg'
import { ReactComponent as AddIcon } from '../../../assets/rounded-add.svg'
import { PaginationTemplate } from './PaginationTemplate'
import { SelectStudies } from './SelectStudies'
import { CategoriesContext } from '../Provider'
import { TemplateStudies } from './types'
import { templates } from './services'


export const StudiesTemplate = ({ show, setShow, ...props }) => {

  const { orders, setOrders, indexOrder } = useContext(CategoriesContext)
  const [studies, setStudies] = useState<Array<TemplateStudies>>(templates)

  //index of studies
  const [template, setTemplate] = useState(studies[0])
  const [page, setPage] = useState(1)
  const perPage = 3
  const maxPagination = Math.ceil(studies.length / perPage)
  

  const confirmationStudies = () => {
    let orderStudies = []
    studies.forEach((el) => {
      el.studiesIndication.forEach((elem) => {
        if (elem.select) {
          orderStudies.push(JSON.parse(JSON.stringify(elem)))
        }
      })
    })

    let copyOrder = JSON.parse(JSON.stringify(orders))
    copyOrder[indexOrder].studies = orderStudies
    setOrders(copyOrder)

    studies.forEach((el) => {
      el.studiesIndication.forEach((elem) => {
        if (elem.select) {
          //clean
          elem.select = false
          elem.indication = "" 
        }
      })
    })

    setShow(false) 
  }

  return (
    <Modal show={show} setShow={setShow} size='full' {...props} noPadding={true}>
      <div className='p-5'>
        <div className='relative'>
          <h2 className='text-2xl font-normal leading-normal mt-0 pt-0 mb-2'>
            Plantillas: Orden de estudios laboratoriales
          </h2>
          <button className='absolute focus:outline-none top-0 right-0' onClick={() => setShow(false)}>
            <CloseIcon></CloseIcon>
          </button>
        </div>
        <div className='flex flex-row'>
          <div className='flex w-full'>
            {studies.slice((page - 1) * perPage, (page - 1) * perPage + perPage).map((data, i) => (
              <div
                key={i}
                className={`flex flex-row justify-center border-b-2 ${data.name === template.name ? 'border-primary-600' : 'border-gray-300'
                  }`}
                style={{ width: '100%', height: '3rem' }}
              >
                <button
                  className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${data.name === template.name ? 'text-primary-600' : 'text-gray-400'
                    }`}
                  onClick={() => {
                    setTemplate(data)
                  }}
                >
                  {data.name}
                </button>
              </div>
            ))}
          </div>
          <PaginationTemplate page={page} setPage={setPage} maxPagination={maxPagination}></PaginationTemplate>
          <button className="focus:outline-none ml-10">
            <AddIcon></AddIcon>
          </button>
        </div>
        <div className="pt-2">
          <h5 className="text-gray-500">{template.desc}</h5>
        </div>
        <div className='w-full pt-2'>
          <SelectStudies template={template} setTemplate={setTemplate} />
        </div>
        <div className='flex flex-row justify-end mt-10 mr-10 mb-1'>
          <button className='focus:outline-none rounded-md bg-primary-600 text-white h-10 w-20' onClick={() => { confirmationStudies() }}>
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  )
}
