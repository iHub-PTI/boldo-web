import React, { useState } from 'react'
import { StudyIndication } from './StudyIndication'
import { ReactComponent as IconAdd } from '../../../assets/add-cross.svg'
import { ReactComponent as IconDele } from '../../../assets/cross-delete.svg'
import { ReactComponent as IconInfo } from '../../../assets/info-icon.svg'
import { ReactComponent as IconTrash } from '../../../assets/trash.svg'
import { StudiesWithIndication } from './types'

export const EditStudyTemplate = ({ id, studies, setStudies, setShow }) => {

    const study = studies.find((data) => data.id === id)
    const copyArray = study.studiesIndication.slice()
    const [state, setState] = useState({
        name: study.name,
        description: study.desc,
    })

    const [newStudy, setNewStudy] = useState({name: '', select: false, indication:''} as StudiesWithIndication)

    const [studyArray, setStudyArray] = useState(copyArray)

    console.log('studyarrayy', studyArray)

    const handleChange = e => {
        setState(state => ({ ...state, [e.target.name]: e.target.value }))
        console.log(state)
    }

    const handleChangeNewStudy = e => {
        setNewStudy({name: e.target.value, select:false, indication:''})
        console.log(newStudy)
    }

    const deleteStudy = i => {
        studyArray.splice(i, 1)
        setStudyArray([...studyArray])
        console.log('eliminar')
    }

    const addStudy = () => {
        studyArray.push(newStudy)
        console.log(studyArray)
        setStudyArray([...studyArray])
        setNewStudy({
            name:'',
            select: false,
            indication: ''
        })
    }

    const saveTemplate = () => {
        const index = studies.findIndex((data)=> data.id === id)
        let copyStudies = JSON.parse(JSON.stringify(studies))
        copyStudies[index].name = state.name
        copyStudies[index].desc = state.description
        copyStudies[index].studiesIndication = [...studyArray]
        setStudies(copyStudies)
        setShow(false)
    }

    const deleteTemplate = () => {
        const index = studies.findIndex((data)=> data.id === id)
        let copyStudies = JSON.parse(JSON.stringify(studies))
        copyStudies.splice(index, 1)
        setStudies(copyStudies)
        setShow(false)
    }

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
                        <IconInfo className="absolute left-4 top-5"></IconInfo>
                        <h5 className='font-bold text-sm text-center mb-2'>Agregar estudio</h5>
                        <p className="text-center">
                            Podés ingresar hasta 15 estudios por cada plantilla personalizada
                        </p>
                    </div>
                </div>
            </div>
            <div className='mt-1 w-full'>
                <h5 className='text-gray-500'>Agregá los estudios corrrespondientes a esta plantilla.</h5>
                <div
                    className='flex flex-row flex-wrap mt-1 w-full overflow-y-auto'
                    style={{ height: '250px', maxHeight: '600px' }}
                >
                    {studyArray.map((item, i) => {
                        return (
                            <div className='relative'>
                                <IconDele className='absolute right-5 top-5 cursor-pointer' onClick={() => deleteStudy(i)}></IconDele>
                                <StudyIndication
                                    id={i}
                                    name={item.name}
                                    check={false}
                                    className='p-3 w-60 m-3 h-28 bg-gray-100 rounded-md'
                                    disabled={true}
                                    disabledCheck={true}
                                    indication=''
                                />
                            </div>
                        )
                    })}
                    <div className='flex flex-col gap-2 h-20 p-1 w-60 m-2'>
                        <label>Nombre del estudio</label>
                        <input
                            className='mt-2 p-1 w-full h-8 rounded-md border border-gray-400 text-sm focs:outline-none outline-none'
                            type='text'
                            name='study name'
                            value={newStudy.name}
                            onChange={e => {
                                handleChangeNewStudy(e)
                            }}
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
                </div>
            </div>
            <div className='flex flex-row justify-end mt-3 relative'>
                    <div className='absolute bottom-1 left-1'>
                      <IconTrash className='cursor-pointer' onClick={() => deleteTemplate()}/>
                    </div>
                <button className='focus:outline-none rounded-md bg-primary-600 text-white h-10 w-20'
                onClick={() => saveTemplate()}>Guardar</button>
            </div>
        </>
    )
}
