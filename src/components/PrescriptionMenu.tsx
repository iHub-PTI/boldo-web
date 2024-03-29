
import axios from "axios"
import React, { useState, useEffect, useCallback } from 'react'
import _ from "lodash";
import { useRouteMatch } from "react-router-dom"
import {
    Grid,
    Typography,
    CardHeader,
    Button,
    CircularProgress
} from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';

import MedicineItem from "./MedicineItem"
import MedicationsModal from "./MedicationsModal";
import useStyles from '../pages/inperson/style'
import { usePrescriptionContext } from "../contexts/Prescriptions/PrescriptionContext";
import { useToasts } from "./Toast";
import InfoIcon from "./icons/info-icons/InfoIcon";
import TooltipInfo from "./hovers/TooltipInfo";
import handleSendSentry from "../util/Sentry/sentryHelper";
import { ERROR_HEADERS } from "../util/Sentry/errorHeaders";


export function PrescriptionMenu({ appointment, isFromInperson = false }: { appointment: any; isFromInperson: boolean }) {
    const [showEditModal, setShowEditModal] = useState(false)
    const { prescriptions, updatePrescriptions } = usePrescriptionContext()
    const [selectedMedication, setSelectedMedication] = useState(prescriptions)
    const [mainReason, setMainReason] = useState('')
    const [selectedSoep, setSelectedSoep] = useState<Boldo.Soep>(undefined)
    const [diagnose, setDiagnose] = useState<string>('')
    const [encounterId, setEncounterId] = useState('')
    const [instructions, setInstructions] = useState<string>('')
    const [initialLoad, setInitialLoad] = useState(true)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    // const [loadingSubmit, setLoadingSubmit] = useState(false)
    const classes = useStyles()
    let match = useRouteMatch<{ id: string }>(`/appointments/:id/${!isFromInperson ? 'call' : 'inperson'}`)
    const id = match?.params.id
    const [isAppointmentDisabled, setAppointmentDisabled] = useState(true)
    const [mainReasonRequired, setMainReasonRequired] = useState(false)
    const [ width, setWidth ] = useState(window.innerWidth)
    const { addToast } = useToasts()
    // boolean handling the hover event
    const [showTooltipInfo, setShowTooltipInfo] = useState(false);


    useEffect(() => {
        updatePrescriptions(id, selectedMedication);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, selectedMedication]);
    
    useEffect(() => {
        if (appointment === undefined || appointment.status === 'locked' || appointment.status === 'upcoming') {
            setAppointmentDisabled(true);
        } else {
            setAppointmentDisabled(false);
        }
    }, [appointment])

    useEffect(() => {
        const load = async () => {
            const url = `/profile/doctor/appointments/${id}/encounter`
            
            await axios
                .get(url)
                .then((res) => {
                    const data = res.data.encounter as Boldo.Encounter
                    // console.log("res",res.data)
                    //const { status = '' } = res.data.encounter
                    setDiagnose(data.diagnosis ?? data.soep.evaluation);
                    setInstructions(data.instructions);
                    setSelectedMedication(data.prescriptions);
                    setMainReason(data.mainReason);
                    //console.log(data.mainReason)
                    setEncounterId(res.data.encounter.partOfEncounterId)
                    setSelectedSoep(res.data.encounter.soep as Boldo.Soep)

                    
                    // send if applicable to the first time
                    if (data.diagnosis === undefined && data.mainReason !== undefined && !isAppointmentDisabled) {
                        debounce({
                            encounterData: {
                                diagnosis: data.soep.evaluation,
                                instructions: data.instructions,
                                prescriptions: [],
                                encounterClass: data.encounterClass,
                                soep: data.soep,
                                mainReason: data.mainReason,
                                partOfEncounterId: res.data.encounter.partOfEncounterId,
                            }
                        })
                    }
                })
                .catch((err) => {
                    const tags = {
                        'endpoint': url,
                        'method': 'GET',
                        'appointment_id': id
                    }
                    handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_GET, tags)
                    addToast({
                        type: 'error',
                        title: 'Ha ocurrido un error.',
                        text: 'No se pudieron cargar los detalles de la receta. ¡Inténtelo nuevamente más tarde!'
                    })
                })
                .finally(() => setInitialLoad(false))
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(mainReason === undefined || mainReason?.trim() === '') setMainReasonRequired(true)
        else setMainReasonRequired(false)
    }, [mainReason])

    const debounce = useCallback(
        _.debounce(async (_encounter: object) => {
            const url = `/profile/doctor/appointments/${id}/encounter`
            try {
                setLoading(true)
                await axios.put(url, _encounter)
                setLoading(false)
                setSuccess(true)
                //console.log('response', res.data)
                console.log('se ha actualizado con exito!')
                setError(false)
            } catch (err) {
                setSuccess(false)
                setLoading(false)
                const tags = {
                    'endpoint': url,
                    'method': 'PUT',
                    'appointment_id': id
                }
                handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_PUT, tags)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error.',
                    text: 'No fue posible actualizar. ¡Inténtelo nuevamente más tarde!'
                })
            }
        }, 1000),
        []
      )
    
    useEffect(() => {
        if(initialLoad === false && !isAppointmentDisabled){
            var result = selectedMedication.map(function (el) {
                var o = Object.assign({}, el);
                if (o.status !== 'completed') {
                    o.status = 'active';
                }
    
                return o;
            })

            if(mainReason?.trim() === '' || mainReason === undefined){
                setMainReasonRequired(true)
                return
            } else if(mainReason !== undefined) {
                setMainReasonRequired(false)
                debounce({
                    encounterData: {
                        diagnosis: diagnose,
                        instructions: instructions,
                        prescriptions: result,
                        encounterClass: 'V',
                        soep: selectedSoep,
                        mainReason: mainReason,
                        partOfEncounterId: encounterId,
                    }
                })
            }
    
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diagnose, instructions, selectedMedication])
    
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
    })


    // functions to handle the mouse event
    const handleMouseEnter = () => {
        setShowTooltipInfo(true);
    }      
    const handleMouseLeave = () => {
        setShowTooltipInfo(false);
    };
      


    if (initialLoad)
        return (
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
        )
    
    return (
        <div className='flex flex-col bg-white shadow-xl h-full'>
            <div 
                style={{
                    height: ` ${width >= 1536 ? 'calc(100vh - 52px)' : 'calc(100vh - 115px)' }`,
                    overflowY: "auto"
                }}
            >

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
                    <Grid className='w-full px-8'>
                        <Typography variant='h5' color='textPrimary'>
                            Receta Médica Electrónica
                        </Typography>

                    </Grid>
                }
                <div className='w-full px-8'>
                    { mainReasonRequired && !isAppointmentDisabled && <span className="text-red-700 mt-7">Obs.: El motivo principal de la visita es obligatoria para poder guardar cambios en esta sección</span>}
                    <div className="mt-3">
                        <Typography variant='body1' color='textPrimary'>
                            Diagnóstico
                        </Typography>

                        <div className={`flex flex-row flex-no-wrap justify-between w-full ${(isAppointmentDisabled || mainReasonRequired) ? 'bg-gray-100':''} rounded-md transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5`}>
                            <div className="flex flex-row w-full">
                                { diagnose && selectedSoep &&
                                    diagnose.toLowerCase().trim() !== selectedSoep.evaluation?.toLowerCase().trim()
                                        ? <div 
                                            className="flex rounded justify-center px-2 bg-gray-200 h-5"
                                        >
                                            <p className="font-bold text-xs">editado</p>
                                        </div>
                                        : <></>
                                }
                                <textarea
                                    id='Diagnostico'
                                    disabled={isAppointmentDisabled || mainReasonRequired}
                                    required
                                    // bg-transparent is used so that the textarea does not highlight
                                    className={`mr-1 w-11/12 bg-transparent resize-none outline-none self-center place-content-center transform ${diagnose?.toLowerCase().trim() !== selectedSoep?.evaluation?.toLowerCase().trim() ? ' translate-x-4 duration-700' : '-translate-x-1 duration-700'}`}
                                    placeholder=''
                                    onChange={e => setDiagnose(e.target.value)}
                                    value={diagnose}
                                />
                            </div>
                            <div 
                                className={`flex flex-row flex-no-wrap`}
                            >
                                {showTooltipInfo && <TooltipInfo />}
                                <InfoIcon onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                            </div>
                        </div>
                        { diagnose && selectedSoep &&
                            diagnose.toLowerCase().trim() !== selectedSoep.evaluation?.toLowerCase().trim()
                                ? !isAppointmentDisabled && (
                                    <button 
                                    onClick={() => setDiagnose(selectedSoep.evaluation ?? '')} 
                                    className="pt-2 font-normal text-sm leading-3 focus:outline-none"
                                >
                                    <p style={{color: "#757575"}}>Click para restaurar</p>
                                </button>
                                )
                                : <></>
                        }
                    </div>
                    <div className='mt-6'>
                        <Typography variant='body1' color='textPrimary'>
                            Observaciones
                        </Typography>

                        <div className='rounded-md shadow-sm'>
                            <textarea
                                id='Indicationes'
                                disabled={isAppointmentDisabled || mainReasonRequired}
                                rows={!isFromInperson ? 3 : 5}
                                className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5 disabled:bg-gray-100'
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
                        <Typography variant='body1' color='textPrimary'>
                            Medicamentos
                        </Typography>
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
                            {isAppointmentDisabled === false && !mainReasonRequired ? <button
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
                            /* onSubmit={async e => {
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
                            }} */
                        >
                            <div className='mt-3'>
                                {
                                    loading && (
                                        <div className='flex justify-items-center items-center mt-2 text-sm text-gray-600 sm:mt-0 sm:mr-2'>
                                            <CircularProgress color="inherit" size={"1rem"} style={{ marginRight: '0.5rem' }} />
                                            Guardando.
                                        </div>
                                    )
                                }
                                {
                                    loading === false && success && (
                                        <div className='flex justify-items-center items-center mt-2 text-sm text-gray-600 sm:mt-0 sm:mr-2'>
                                            <DoneIcon fontSize="small" style={{ marginRight: '0.5rem' }} />
                                            Guardado.
                                            {console.log("estado actual: ", selectedMedication)}
                                        </div>
                                    )
                                }
                                {
                                    error && (
                                        <div className='mt-2 text-sm text-red-600 sm:mt-0 sm:mr-2'>
                                            Ha ocurrido un error.
                                        </div>
                                    )
                                }

                                {/* {success && (
                                    <span className='mt-2 text-sm text-green-600 sm:mt-0 sm:mr-2'>
                                        Datos guardados correctamente.
                                    </span>
                                )}
                                {error && (
                                    <span className='mt-2 text-sm text-red-600 sm:mt-0 sm:mr-2'>
                                        {error}
                                    </span>
                                )} */}
                            </div>
                            {/* <div className='flex w-full mt-5 mb-12 jusitfy-end'>
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
                            </div> */}
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
            </div>
        </div>
    )
}