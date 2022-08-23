import React, { useState } from 'react'
import Modal from '../../Modal'
import { ReactComponent as CloseIcon } from '../../../assets/close.svg'
import {ReactComponent as AddIcon } from '../../../assets/rounded-add.svg'
import { PaginationTemplate } from './PaginationTemplate'
import { SelectStudies } from './SelectStudies'

interface StudiesWithIndication {
  name: string
  select: boolean
  indication: string
}

interface StudiesTemplate {
  id: number,
  name: string
  desc?: string
  studiesIndication?: Array<StudiesWithIndication>
}


export const StudiesTemplate = ({ show, setShow, ...props }) => {
  const [studies, setStudies] = useState<Array<StudiesTemplate>>([
    {
      id: 1,
      name: "Predeterminado",
      desc: "Esta lista contiene los estudios solicitados con más frecuencia en la especialidad de gastroenterología.",
      studiesIndication: [
        {
          name:"Hemograma",
          select: false,
          indication: ""
        },
        {
          name:"Hemograma completo",
          select: false,
          indication: ""
        },
        {
          name:"Heces por parásito, sangre oculta",
          select: false,
          indication: ""
        },
        {
          name:"Perfil renal",
          select: false,
          indication: ""
        }
      ],
    },
    {
      id: 2,
      name: "Pancreatitis",
      desc: "Estudios solicitados en sospecha de pancreatitis o seudoquiste pancreático.",
      studiesIndication: [],
    },
    {
      id: 3,
      name: "Checkeo Anual",
      desc: "",
      studiesIndication: [],
    },
    {
      id: 4,
      name: "Template1",
      desc: "",
      studiesIndication: [],
    },
    {
      id: 5,
      name: "Template2",
      desc: "",
      studiesIndication: [],
    },
    {
      id: 6,
      name: "Template3",
      desc: "",
      studiesIndication: [],
    }
  ])
  
  const [template, setTemplate] = useState(studies[0])
  const [page, setPage] = useState(1)
  const perPage = 3
  const maxPagination = Math.ceil(studies.length / perPage)

  return (
    <Modal show={show} setShow={setShow} size='full' {...props}>
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
              className={`flex flex-row justify-center border-b-2 ${
                data.name === template.name ? 'border-primary-600' : 'border-gray-300'
              }`}
              style={{ width: '100%', height: '3rem' }}
            >
              <button
                className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${
                  data.name === template.name ? 'text-primary-600' : 'text-gray-400'
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
        <SelectStudies template={template} setTemplate={setTemplate} studies={studies} setStudies={setStudies} />
      </div>
    </Modal>
  )
}
