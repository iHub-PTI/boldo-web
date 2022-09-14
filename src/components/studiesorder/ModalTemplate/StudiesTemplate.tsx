import React, { useState, useContext, useEffect } from 'react'
import Modal from '../../Modal'
import { ReactComponent as CloseIcon } from '../../../assets/close.svg'
import { ReactComponent as AddIcon } from '../../../assets/rounded-add.svg'
import { ReactComponent as EditIcon } from '../../../assets/edit-icon.svg'
import { PaginationTemplate } from './PaginationTemplate'
import { SelectStudies } from './SelectStudies'
import { CategoriesContext } from '../Provider'
import { TemplateStudies } from './types'
import { CreateStudyTemplate } from './CreateStudyTemplate'
import { EditStudyTemplate } from './EditStudyTemplate'
import axios from 'axios'

export const StudiesTemplate = ({ show, setShow, ...props }) => {
  const { orders, setOrders, indexOrder } = useContext(CategoriesContext)
  // Hook for getting templates
  const [studies, setStudies] = useState<Array<TemplateStudies>>([])
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [showEditTemplate, setShowEditTemplate] = useState(false)
  const [idEditStudy, setIdEditStudy] = useState(undefined)

  //index of studies
  const [template, setTemplate] = useState<TemplateStudies>(undefined)
  const [page, setPage] = useState(1)
  const perPage = 3
  const [maxPagination, setMaxPagination] = useState(0)

  //hooks for controlling the error and loading state
  //const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // hooks for controlling when templates is empty
  const [emptyTemp, setEmptyTemp] = useState(false)

  const confirmationStudies = () => {
    let orderStudies = []
    studies.forEach(el => {
      el.studiesIndication.forEach(elem => {
        if (elem.select && elem.status) {
          orderStudies.push(JSON.parse(JSON.stringify(elem)))
        }
      })
    })

    let copyOrder = JSON.parse(JSON.stringify(orders))
    copyOrder[indexOrder].studies_codes = orderStudies
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

  const validateStudiesTemplates = studies => {
    let count = 0
    studies.forEach(stud => {
      if (stud.status === true) {
        count++
      }
    })
    if (count <= 0) setEmptyTemp(true)
    else setEmptyTemp(false)
  }

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`profile/doctor/studyOrderTemplate`)
      console.log(res)
      if (res.status === 200) {
        let templates = []
        res.data
          .filter(obj => obj.status === true)
          .forEach(item => {
            let temp = {} as TemplateStudies
            temp.id = item.id
            temp.name = item.name
            temp.description = item.description
            temp.status = item.status
            temp.studiesIndication = item.StudyOrderTemplateDetails
            // select and indicaciont are added
            temp.studiesIndication.forEach(e => {
              e.select = false
              e.indication = ''
            })
            templates.push(temp)
          })
        console.log('response templates', templates)
        validateStudiesTemplates(studies)
        setStudies(templates)
        setTemplate(templates[0])
        setMaxPagination(Math.ceil(templates.length / perPage))
      } else if (res.status === 204) {
        toggleNewTemplate()
        setLoading(false)
        setEmptyTemp(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (show === false) {
      setShowAddTemplate(false)
      setShowEditTemplate(false)
    }
  }, [show])

  useEffect(() => {
    console.log('study', studies.length)
    if (studies.length > 0) {
      //reset pagination
      setMaxPagination(Math.ceil(studies.length / perPage))
      //reset view on change
      setTemplate(studies[0])
      setPage(1)
      setEmptyTemp(false)
      setLoading(false)
    } else {
      setEmptyTemp(true)
      setTemplate(undefined)
    }
  }, [studies])

  useEffect(() => {
    setTemplate(studies[(page - 1) * perPage])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, maxPagination])

  return (
    <Modal show={show} setShow={setShow} size='full' handleOutClick={false} {...props} noPadding={true}>
      <div className='p-5'>
        <div className='relative'>
          <h2 className='text-2xl font-normal leading-normal mt-0 pt-0 mb-2'>
            Plantillas: Orden de estudios laboratoriales
          </h2>
          <button className='absolute focus:outline-none top-0 right-0' onClick={() => setShow(false)}>
            <CloseIcon></CloseIcon>
          </button>
        </div>
        {(loading === false && showAddTemplate && show && template !== undefined) ||
        (loading === false && showAddTemplate && show && template === undefined) ||
        (emptyTemp && loading === false)? (
          <CreateStudyTemplate studies={studies} setStudies={setStudies} setShow={setShowAddTemplate} />
        ) : loading === false && showEditTemplate && show && template !== undefined ? (
          <EditStudyTemplate
            id={idEditStudy}
            studies={studies}
            setStudies={setStudies}
            setShow={setShowEditTemplate}
          ></EditStudyTemplate>
        ) : !loading && template !== undefined ? (
          <div className='relative'>
            <div className='flex flex-row'>
              <div className='flex w-full'>
                {studies.slice((page - 1) * perPage, (page - 1) * perPage + perPage).map((data, i) => (
                  <div
                    key={i}
                    className={`flex flex-row justify-center border-b-2 ${
                      data.id === template.id ? 'border-primary-600' : 'border-gray-300'
                    }`}
                    style={{ width: '100%', height: '3rem' }}
                  >
                    <button
                      className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${
                        data.id === template.id ? 'text-primary-600' : 'text-gray-400'
                      }`}
                      onClick={() => {
                        setTemplate(data)
                      }}
                    >
                      {data.name}
                    </button>

                    <div className='absolute bottom-1 left-1'>
                      <EditIcon
                        title='Editar plantilla'
                        className='cursor-pointer'
                        onClick={() => editTemplate(template.id)}
                      />
                    </div>
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
                <AddIcon title='Agregar nueva plantilla'></AddIcon>
              </button>
            </div>
            <div className='pt-2'>
              <h5 className='text-gray-500'>{template.description}</h5>
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
        ) : (
          <div className='flex items-center justify-center w-full h-full py-64'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
              <svg
                className='w-6 h-6 text-secondary-500 animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
