import React, { useContext, useEffect, useState } from 'react'
import { StudyIndication } from './StudyIndication'
import { ReactComponent as IconAdd } from '../../../assets/add-cross.svg'
import { ReactComponent as IconDele } from '../../../assets/cross-delete.svg'
import { ReactComponent as IconInfo } from '../../../assets/info-icon.svg'
import { ReactComponent as IconTrash } from '../../../assets/trash.svg'
import { ReactComponent as Spinner } from '../../../assets/spinner.svg'
import { StudiesWithIndication } from './types'
import ConfirmationTemplate from './ConfirmationTemplate'
import { useToasts } from '../../Toast'
import axios from 'axios'
import { CategoriesContext } from '../Provider'

export const EditStudyTemplate = ({ id, studies, setStudies, setShow, ...props }) => {
  const study = studies.find(data => data.id === id)
  const copyArray = study.studiesIndication.slice()
  const [state, setState] = useState({
    name: study.name,
    description: study.description,
  })
  const { orders, setOrders, indexOrder } = useContext(CategoriesContext)

  const [loading, setLoading] = useState(false)

  //confirmation delete template
  const [isOpen, setIsOpen] = useState(false)

  const [newStudy, setNewStudy] = useState({
    name: '',
    select: false,
    indication: '',
    status: true,
  } as StudiesWithIndication)

  const [studyArray, setStudyArray] = useState(copyArray)

  const [maxStudies, setMaxStudies] = useState(false)

  const { addToast, addErrorToast } = useToasts()

  console.log('studyarrayy', studyArray)

  const handleChange = e => {
    setState(state => ({ ...state, [e.target.name]: e.target.value }))
    console.log(state)
  }

  const handleChangeNewStudy = e => {
    setNewStudy({ name: e.target.value, select: false, indication: '', status: true })
    console.log(newStudy)
  }

  const deleteStudyIndex = index => {
    studyArray.splice(index, 1)
    setStudyArray([...studyArray])
    console.log('eliminar')
    setMaxStudies(false)
  }

  const deleteStudyId = id => {
    let ind = studyArray.findIndex(obj => obj.id === id)
    studyArray[ind].status = false
    setStudyArray([...studyArray])
    setMaxStudies(false)
    console.log('elimnado con id', studyArray)
  }

  const addStudy = () => {
    if (studyArray.filter(obj => obj.status === true).length < 15 && newStudy.name.trim() !== '') {
      studyArray.unshift(newStudy)
      console.log(studyArray)
      setStudyArray([...studyArray])
      setNewStudy({
        name: '',
        select: false,
        indication: '',
        status: true,
      })
    }
  }

  const validateEditTemplate = data => {
    if (data.name.trim() === '') {
      addToast({ type: 'warning', title: 'Notificación', text: 'El nombre de la plantilla es un campo obligatorio.' })
      return false
    } else if (data.StudyOrderTemplateDetails.length <= 0) {
      addToast({ type: 'warning', title: 'Notificación', text: 'Debe agregar al menos un estudio.' })
      return false
    } else {
      for (let i = 0; i < data.StudyOrderTemplateDetails.length; i++) {
        const e = data.StudyOrderTemplateDetails[i];
        if (e.name.trim() === '') {
          addToast({
            type: 'warning',
            title: 'Notificación',
            text: 'Los nombres de los campos del estudio son obligatorios.',
          })
          return false
        }
      }
    }

    return true
  }

  const saveTemplate = async () => {
    try {
      let details = []
      studyArray.forEach(obj => {
        if (obj.id !== undefined) {
          if (obj.status) {
            details.push({
              id: obj.id,
              name: obj.name,
            })
          } else {
            details.push({
              id: obj.id,
              name: obj.name,
              status: obj.status,
            })
          }
        } else {
          details.push({
            name: obj.name,
          })
        }
      })

      let dataTemplate = {
        name: state.name,
        description: state.description,
        StudyOrderTemplateDetails: details,
      }

      if (validateEditTemplate(dataTemplate)) {
        setLoading(true)
        console.log("id template", id)
        const res = await axios.put(`/profile/doctor/studyOrderTemplate/${id}`, dataTemplate)
        let index = studies.findIndex(el => el.id === res.data.id)
        studies[index] = {
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          studiesIndication: res.data.StudyOrderTemplateDetails
        }
        props.setActionPage('update')
        setStudies([...studies])
        setShow(false)
        setLoading(false)
        addToast({ type: 'success', title: 'Notificación', text: '¡La plantilla ha sido editada con exito!' })
      }
    } catch (err) {
      console.log(err)
      addErrorToast("Ha ocurrido un error vuelva a intentarlo o pruebe recargar la página.")
      setLoading(false)
    }
  }

  const deleteTemplate = async () => {

    try {
      setLoading(true)
      const res = await axios.put(`/profile/doctor/studyOrderTemplate/inactivate/${id}`)
      console.log('eliminar template con id:', id)
      console.log("index", indexOrder)
      console.log(res.data)
      const index = studies.findIndex(data => data.id === res.data.id)
      let copyStudies = JSON.parse(JSON.stringify(studies))
      copyStudies.splice(index, 1)
      setShow(false)
      console.log("copy", copyStudies)
      props.setActionPage('remove')
      setStudies(copyStudies)
      updateStudiesOrder(res.data)
      setLoading(false)
      addToast({ type: 'success', title: 'Notificación', text: '¡La plantilla ha sido eliminada con exito!' })
    } catch (err) {
      console.log(err)
      addErrorToast("Ha ocurrido un error vuelva a intentarlo o pruebe recargar la página.")
      setLoading(false)
    }
  }

  //function to update studies of already confirmed orders
  const updateStudiesOrder = (template) => {
    let copyOrders = JSON.parse(JSON.stringify(orders))
    copyOrders.forEach((or)=>{
      or.studies_codes = []
    })
    console.log(copyOrders)
    setOrders(copyOrders)
  }

  useEffect(() => {
    if (studyArray.filter(obj => obj.status === true).length >= 15) setMaxStudies(true)
  }, [studyArray])


  return (
    <>
      <div>
        <h2 className='text-primary-600 text-2xl'>Editar Plantilla</h2>
      </div>
      <div className='flex flex-row w-full'>
        <div className='flex flex-col w-6/12'>
          <div className='flex flex-col'>
            <label>Nombre</label>
            <input
              className='outline-none h-9 border border-gray-300 rounded-md p-2 w-full'
              type='text'
              name='name'
              value={state.name}
              onChange={e => {
                handleChange(e)
              }}
            />
          </div>
          <div className='flex flex-col mt-3 mb-3'>
            <label>Descripción</label>
            <input
              className='outline-none h-9 border border-gray-300 rounded-md p-2 w-full'
              name='description'
              type='text'
              value={state.description}
              onChange={e => {
                handleChange(e)
              }}
            />
          </div>
        </div>
        <div className='flex flex-row justify-center w-6/12'>
          <div className='w-72 m-1 p-5 shadow-md rounded-md relative'>
            <IconInfo className='absolute left-4 top-5'></IconInfo>
            <h5 className='font-bold text-sm text-center mb-2'>Agregar estudio</h5>
            <p className='text-center'>Podés ingresar hasta 15 estudios por cada plantilla personalizada</p>
          </div>
        </div>
      </div>
      <div className='mt-1 w-full'>
        <h5 className='text-gray-500'>Agregá los estudios corrrespondientes a esta plantilla.</h5>
        <div
          className='flex flex-row flex-wrap mt-1 w-full overflow-y-auto'
          style={{ height: '250px', maxHeight: '600px' }}
        >
          <div className={`flex flex-col gap-2 h-20 p-1 ${props.remoteMode ? 'w-52' : 'w-60'} m-2`}>
            <label>Nombre del estudio</label>
            <input
              className='mt-2 p-1 w-full h-8 rounded-md border border-gray-400 text-sm focs:outline-none outline-none disabled:bg-gray-300'
              type='text'
              name='study name'
              value={newStudy.name}
              onChange={e => {
                handleChangeNewStudy(e)
              }}
              disabled={maxStudies ? true : false}
            />
            <div className='flex flex-row justify-end'>
              <button
                className='btn focus:outline-none border-primary-600 border-2 mx-3 px-3 my-1 py-1 rounded-lg text-primary-600 font-semibold flex flex-row'
                onClick={() => addStudy()}
              >
                Agregar
                <span className='pt-2 mx-2'>
                  <IconAdd></IconAdd>
                </span>
              </button>
            </div>
          </div>
          {studyArray.map((item, i) => {
            if (item.status === true) {
              return (
                <div className='relative'>
                  {item.id === undefined ? (
                    <IconDele className='absolute right-5 top-5 cursor-pointer' onClick={() => deleteStudyIndex(i)} />
                  ) : (
                    <IconDele
                      className='absolute right-5 top-5 cursor-pointer'
                      onClick={() => deleteStudyId(item.id)}
                    />
                  )}
                  <StudyIndication
                    id={item.id === undefined ? i : item.id}
                    name={item.name}
                    check={false}
                    className={`p-3 ${props.remoteMode ? 'w-52' : 'w-60'} m-3 h-auto bg-gray-100 rounded-md`}
                    disabled={true}
                    disabledCheck={true}
                    indication=''
                  />
                </div>
              )
            } else {
              return false
            }
          })}
          
        </div>
      </div>
      <div className='flex flex-row justify-end mt-3 relative'>
        <div className='absolute bottom-1 left-1'>
          <IconTrash title='Eliminar plantilla' className='cursor-pointer' onClick={() => setIsOpen(true)} />
          <ConfirmationTemplate
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Eliminar plantilla ${state.name}`}
            message={'¿Usted está seguro que quiere eliminar la plantilla? Esto restablecera todos los estudios seleccionados en las órdenes.'}
            callBack={deleteTemplate}
            loading={loading}
          />
        </div>
        <button
          className='focus:outline-none rounded-md bg-primary-600 text-white h-10 w-auto p-2 flex flex-row justify-center items-center disabled:bg-gray-300 disabled:cursor-not-allowed'
          onClick={() => saveTemplate()}
          disabled={loading}
        >
          {loading ? <Spinner /> : ''}
          Guardar
        </button>
      </div>
    </>
  )
}
