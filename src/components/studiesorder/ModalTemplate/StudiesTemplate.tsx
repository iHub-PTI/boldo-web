import React, { useState, useContext, useEffect } from 'react'
import Modal from '../../Modal'
import { ReactComponent as CloseIcon } from '../../../assets/close.svg'
import { ReactComponent as AddIcon } from '../../../assets/rounded-add.svg'
import { ReactComponent as EditIcon } from '../../../assets/edit-icon.svg'
import { PaginationTemplate } from './PaginationTemplate'
import { SelectStudies } from './SelectStudies'
import { CategoriesContext } from '../Provider'
import { TemplateStudies } from './types'
import { templates } from './services'
import { CreateStudyTemplate } from './CreateStudyTemplate'
import { EditStudyTemplate } from './EditStudyTemplate'
import { info } from 'console'

export const StudiesTemplate = ({ show, setShow, ...props }) => {
  const { orders, setOrders, indexOrder } = useContext(CategoriesContext)
  const [studies, setStudies] = useState<Array<TemplateStudies>>(templates)
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [showEditTemplate, setShowEditTemplate] = useState(false)
  const [idEditStudy, setIdEditStudy] = useState(undefined)

  //index of studies
  const [template, setTemplate] = useState(studies[0])
  const [page, setPage] = useState(1)
  const perPage = 3
  const [maxPagination, setMaxPagination] = useState(Math.ceil(studies.length / perPage))

  const confirmationStudies = () => {
    let orderStudies = []
    studies.forEach(el => {
      el.studiesIndication.forEach(elem => {
        if (elem.select) {
          orderStudies.push(JSON.parse(JSON.stringify(elem)))
        }
      })
    })

    let copyOrder = JSON.parse(JSON.stringify(orders))
    copyOrder[indexOrder].studies = orderStudies
    setOrders(copyOrder)

    studies.forEach(el => {
      el.studiesIndication.forEach(elem => {
        if (elem.select) {
          //clean
          elem.select = false
          elem.indication = ''
        }
      })
    })
    setTemplate(studies[0])
    setPage(1)
    setShow(false)
  }

  const toggleNewTemplate = () => {
    setShowAddTemplate(true)
  }

  const editTemplate = id => {
    setIdEditStudy(id)
    setShowEditTemplate(true)
  }

  useEffect(() => {
    if (show === false) {
      setShowAddTemplate(false)
      setShowEditTemplate(false)
    }
  }, [show])

  useEffect(() => {
    //reset pagination
    setMaxPagination(Math.ceil(studies.length / perPage))
    //reset view on change
    setTemplate(studies[0])
    setPage(1)

  }, [studies])

  useEffect(()=>{
      setTemplate(studies[(page - 1) * perPage])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, maxPagination])

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
        {showAddTemplate && show ? (
          <CreateStudyTemplate studies={studies} setStudies={setStudies} setShow={setShowAddTemplate} />
        ) : showEditTemplate && show ? (
          <EditStudyTemplate
            id={idEditStudy}
            studies={studies}
            setStudies={setStudies}
            setShow={setShowEditTemplate}
          ></EditStudyTemplate>
        ) : (
          <div className='relative'>
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
                    {!template.default && (
                      <div className='absolute bottom-1 left-1'>
                        <EditIcon className='cursor-pointer' onClick={() => editTemplate(template.id)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <PaginationTemplate page={page} setPage={setPage} maxPagination={maxPagination}></PaginationTemplate>
              <button
                className='focus:outline-none ml-10'
                onClick={() => {
                  toggleNewTemplate()
                }}
              >
                <AddIcon></AddIcon>
              </button>
            </div>
            <div className='pt-2'>
              <h5 className='text-gray-500'>{template.desc}</h5>
            </div>
            <div className='w-full pt-2'>
              <SelectStudies template={template} setTemplate={setTemplate} />
            </div>
            <div className='flex flex-row justify-end mt-10 mr-10 mb-1'>
              <button
                className='focus:outline-none rounded-md bg-primary-600 text-white h-10 w-20'
                onClick={() => {
                  confirmationStudies()
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
