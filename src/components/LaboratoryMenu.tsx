
import axios from "axios"
import React, { useState, useEffect } from 'react'
import { useRouteMatch } from "react-router-dom"
import {
    Grid,
    Typography,
    CardHeader,
    Button,


} from '@material-ui/core';

import MedicineItem from "./MedicineItem"
import MedicationsModal from "./MedicationsModal";
import useStyles from '../pages/inperson/style'
export function LaboratoryMenu({ appointment, isFromInperson = false }: { appointment: any; isFromInperson: boolean }) {
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState<any[]>([])
    const [mainReason, setMainReason] = useState<any[]>([])
    const [selectedSoep, setSelectedSoep] = useState()
    const [diagnose, setDiagnose] = useState<string>('')
    const [encounterId, setEncounterId] = useState('')
    const [instructions, setInstructions] = useState<string>('')
    const [initialLoad, setInitialLoad] = useState(true)

    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const classes = useStyles()
    let match = useRouteMatch<{ id: string }>(`/appointments/:id/${!isFromInperson ? 'call' : 'inperson'}`)
    const id = match?.params.id
    const [isAppointmentDisabled, setAppointmentDisabled] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`)
                const { status = '' } = res.data.encounter
                if (status === 'finished' || status === 'locked' || status === 'cancelled') {
                    setAppointmentDisabled(true);
                } else {
                    setAppointmentDisabled(false);
                }
                setDiagnose(res.data.encounter.diagnosis);
                setInstructions(res.data.encounter.instructions);
                setSelectedMedication(res.data.encounter.prescriptions);
                setMainReason(res.data.encounter.mainReason);
                setEncounterId(res.data.encounter.partOfEncounterId)
                setSelectedSoep(res.data.encounter.soep)
            } catch (err) {
                console.log(err)
            } finally {
                setInitialLoad(false)
            }
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (initialLoad)
        return (
            <div style={{ width: '300px' }} className='flex items-center justify-center w-full h-full py-64'>
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
        )
    return (
        <div className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
            <Grid>

                {!isFromInperson ?
                    <>
                        <CardHeader title="Receta" titleTypographyProps={{ variant: 'h6' }} style={{ backgroundColor: '#27BEC2', color: 'white' }} />
                        <Grid style={{ padding: '20px' }}>
                            <Typography variant="h6" color="textPrimary">
                                {appointment.patient.givenName} {appointment.patient.familyName}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                CI: {appointment.patient.identifier}
                            </Typography>

                        </Grid>
                    </>
                    :
                    <Grid className='w-full px-8 mt-10'>
                        <Typography variant='h5' color='textPrimary'>
                            Resultados de estudios
                        </Typography>

                    </Grid>
                }
                <div className='w-full px-8'>
                    <div className='mt-6 '>
                        <label htmlFor='Diagnostico' className='block text-sm font-medium leading-5 text-gray-600'>
                            Diagnóstico
                        </label>

                        <div className='rounded-md shadow-sm'>
                            <textarea
                                id='Diagnostico'
                                disabled={isAppointmentDisabled}
                                required
                                rows={!isFromInperson ? 3 : 5}
                                className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5'
                                placeholder=''
                                onChange={e => setDiagnose(e.target.value)}
                                value={diagnose}
                            />
                        </div>
                    </div>
                    <div className='mt-6'>
                        <label htmlFor='Indicationes' className='block text-sm font-medium leading-5 text-gray-600'>
                            Indicaciones
                        </label>

                        <div className='rounded-md shadow-sm'>
                            <textarea
                                id='Indicationes'
                                disabled={isAppointmentDisabled}
                                rows={!isFromInperson ? 3 : 5}
                                className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5'
                                placeholder=''
                                onChange={e => setInstructions(e.target.value)}
                                value={instructions}
                            />
                        </div>
                    </div>
                    <div className='mt-6'>
                        {/* <Medication setDataCallback={(elem: any) => {
  
                // const itemsToAdd: any[] = []
                // const selectedMedicationsCopy: any[] = [...selectedMedication]
                // for (let el in elem) {
                //   const myElemIndex = selectedMedicationsCopy.findIndex(e => elem[el].medicationId == e.medicationId)
  
                //   if (myElemIndex == -1) {
                //     itemsToAdd.push(elem[el])
                //   }
                // }
                setSelectedMedication([...selectedMedication, elem])
                // setShowEditModal(false)
              }} /> */}
                    </div>
                    <div className='mt-6'>
                        <p className='block text-sm font-medium leading-5 text-gray-700'>Medicamentos</p>
                        <div className='h-px mt-2 mb-4 bg-gray-200'></div>
                        {selectedMedication &&
                            selectedMedication.map((e: any) => (
                                <MedicineItem
                                    key={e.medicationId}
                                    medicine={e}
                                    deleteMedicineCallback={() => {
                                        const selectedMedicationsCopy: any[] = [...selectedMedication]
                                        const filteredItems = selectedMedicationsCopy.filter(el => el.medicationId !== e.medicationId)

                                        setSelectedMedication(filteredItems)
                                    }}
                                    isMedidicineEditionDisabled={isAppointmentDisabled}
                                    changeDescriptionCallback={(instructions: String) => {
                                        const selectedMedicationsCopy: any[] = [...selectedMedication]
                                        const myElemIndex = selectedMedicationsCopy.findIndex(el => el.medicationId === e.medicationId)
                                        if (myElemIndex !== -1) {
                                            selectedMedicationsCopy[myElemIndex].instructions = instructions
                                            setSelectedMedication(selectedMedicationsCopy)
                                        }
                                    }}
                                />
                            ))}
                        <span className='rounded-md shadow-sm'>
                            {isAppointmentDisabled === false ? <button
                                type='button'
                                className=' mt-5 inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                                onClick={e => {
                                    setShowEditModal(true)
                                }}
                            >
                                agregar medicamento
                                <svg className='ml-3' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 7.5H7.5V8V13C7.5 13.2739 7.27386 13.5 7 13.5C6.72614 13.5 6.5 13.2739 6.5 13V8V7.5H6H1C0.726142 7.5 0.5 7.27386 0.5 7C0.5 6.72614 0.726142 6.5 1 6.5H6H6.5V6V1C6.5 0.726142 6.72614 0.5 7 0.5C7.27386 0.5 7.5 0.726142 7.5 1V6V6.5H8H13C13.2739 6.5 13.5 6.72614 13.5 7C13.5 7.27386 13.2739 7.5 13 7.5H8Z" fill="white" stroke="white" />
                                </svg>

                            </button> : <Button disabled
                                className={classes.muiButtonOutlined} variant='outlined'>
                                {'agregar medicamento'}
                                <svg className='ml-3' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 7.5H7.5V8V13C7.5 13.2739 7.27386 13.5 7 13.5C6.72614 13.5 6.5 13.2739 6.5 13V8V7.5H6H1C0.726142 7.5 0.5 7.27386 0.5 7C0.5 6.72614 0.726142 6.5 1 6.5H6H6.5V6V1C6.5 0.726142 6.72614 0.5 7 0.5C7.27386 0.5 7.5 0.726142 7.5 1V6V6.5H8H13C13.2739 6.5 13.5 6.72614 13.5 7C13.5 7.27386 13.2739 7.5 13 7.5H8Z" fill="white" stroke="white" />
                                </svg>

                            </Button>}
                        </span>
                        <form
                            onSubmit={async e => {
                                e.preventDefault()
                                if (diagnose === '' || diagnose === undefined) {
                                    setError('Escriba un diagnóstico primero')
                                    setSuccess('')
                                } else {
                                    try {
                                        setSuccess('')
                                        setError('')
                                        setLoadingSubmit(true)
                                        var result = selectedMedication.map(function (el) {
                                            var o = Object.assign({}, el);
                                            if (o.status !== 'completed') {
                                                o.status = 'active';
                                            }

                                            return o;
                                        })

                                        await axios.put(`/profile/doctor/appointments/${id}/encounter`, {
                                            encounterData: {
                                                diagnosis: diagnose,
                                                instructions: instructions,
                                                prescriptions: result,
                                                encounterClass: 'V',
                                                soep: selectedSoep,
                                                mainReason: mainReason,
                                                partOfEncounterId: encounterId,
                                            },
                                        })
                                        setSuccess('The medical data was set successfully.')
                                    } catch (err) {
                                        setError('Ocurrió un error. Intente nuevamente mas tarde')
                                        console.log(err)
                                    } finally {
                                        setLoadingSubmit(false)
                                    }
                                }
                            }}
                        >
                            <div className='mt-3'>
                                {success && (
                                    <span className='mt-2 text-sm text-green-600 sm:mt-0 sm:mr-2'>
                                        Datos guardados correctamente.
                                    </span>
                                )}
                                {error && (
                                    <span className='mt-2 text-sm text-red-600 sm:mt-0 sm:mr-2'>
                                        {error}
                                    </span>
                                )}
                            </div>

                            <div className='flex w-full mt-5 mb-12 jusitfy-end'>
                                <div className='mt-3 ml-auto sm:flex'>
                                    <span className='flex w-full mt-3 ml-auto rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>

                                        <Button disabled={loadingSubmit || isAppointmentDisabled}
                                            type='submit' className={classes.muiButtonOutlined} variant='outlined'>
                                            {!isFromInperson ? 'Guardar' : 'Listo'}
                                            {loadingSubmit && (
                                                <svg
                                                    className='w-5 h-5 mr-3 ml-3 text-indigo-700 animate-spin'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <circle
                                                        className='opacity-25'
                                                        cx='12'
                                                        cy='12'
                                                        r='10'
                                                        stroke='currentColor'
                                                        strokeWidth='4'
                                                    ></circle>
                                                    <path
                                                        className='opacity-75'
                                                        fill='currentColor'
                                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                                    ></path>
                                                </svg>
                                            )}
                                        </Button>
                                    </span>
                                </div>
                            </div>


                        </form>
                    </div>

                    <MedicationsModal
                        selectedMedicaitonsState={selectedMedication}
                        showEditModal={showEditModal}
                        setShowEditModal={setShowEditModal}
                        setDataCallback={(elem: any) => {
                            const itemsToAdd: any[] = []
                            const selectedMedicationsCopy: any[] = [...selectedMedication]
                            for (let el in elem) {
                                const myElemIndex = selectedMedicationsCopy.findIndex(e => elem[el].medicationId === e.medicationId)

                                if (myElemIndex === -1) {
                                    itemsToAdd.push(elem[el])
                                }
                            }
                            setSelectedMedication([...selectedMedication, ...itemsToAdd])
                            setShowEditModal(false)
                        }}
                    />
                </div>
            </Grid>
        </div>
    )
}