
import axios from "axios"
import React, {useState,useEffect } from 'react'
import { useRouteMatch } from "react-router-dom"
import {
    Grid,
    Typography,
    CardHeader,

  
  } from '@material-ui/core';

import MedicineItem from "./MedicineItem"
import MedicationsModal from "./MedicationsModal";

export function PrescriptionMenu({ appointment,isFromInperson=false }: { appointment: any;isFromInperson:boolean }) {
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
  
    let match = useRouteMatch<{ id: string }>(`/appointments/:id/${!isFromInperson ?'call':'inperson'}`)
    const id = match?.params.id
  
    useEffect(() => {
      const load = async () => {
        try {
          const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`)
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
        <Grid style={{ minWidth: '350px' }} >
          <CardHeader title="Receta" titleTypographyProps={{ variant: 'h6' }} style={{ backgroundColor: '#27BEC2', color: 'white' }} />
         { !isFromInperson && <Grid style={{ padding: '20px' }}>
            <Typography variant="h6" color="textPrimary">
              {appointment.patient.givenName} {appointment.patient.familyName}
            </Typography>
            {/* <Typography variant="subtitle2" color="textSecondary">
              <DateFormatted start={appointment.start} end={appointment.end} />
              </Typography> */}
            <Typography variant="subtitle1" color="textSecondary">
              CI: {appointment.patient.identifier}
            </Typography>
  
          </Grid>}
          <div className='w-full px-8'>
            <div className='mt-6 '>
              <label htmlFor='Diagnostico' className='block text-sm font-medium leading-5 text-gray-600'>
                Diagnóstico
              </label>
  
              <div className='rounded-md shadow-sm'>
                <textarea
                  id='Diagnostico'
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
              <button
                onClick={() => {
                  setShowEditModal(true)
                }}
                type='button'
                className='inline-flex items-center justify-center pt-3 pb-2 text-base font-medium leading-6 text-indigo-700 transition duration-150 ease-in-out border-gray-300 rounded-md sm:text-sm sm:leading-5 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo'
              >
                <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M16 9C16.5523 9 17 9.44772 17 10V15H22C22.5523 15 23 15.4477 23 16C23 16.5523 22.5523 17 22 17H17V22C17 22.5523 16.5523 23 16 23C15.4477 23 15 22.5523 15 22V17H10C9.44772 17 9 16.5523 9 16C9 15.4477 9.44772 15 10 15L15 15V10C15 9.44772 15.4477 9 16 9Z'
                    fill='#9CA3AF'
                  />
                  <rect x='1' y='1' width='30' height='30' rx='15' stroke='#D1D5DB' strokeWidth='2' strokeDasharray='4 4' />
                </svg>
                <p className='ml-4 block text-sm font-medium leading-5 text-gray-700'>Agregar medicamentos</p>
              </button>
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
                          status: "in-progress",
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
  
                <div className='flex w-full mb-12 jusitfy-end'>
                  <div className='mt-3 ml-auto sm:flex'>
                    <span className='flex w-full mt-3 ml-auto rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
                      <button
                        disabled={loadingSubmit}
                        type='submit'
                        className='inline-flex justify-center w-full px-4 pt-3 pb-2 text-base font-medium leading-6 text-indigo-700 transition duration-150 ease-in-out bg-indigo-100 border-gray-300 rounded-md shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200'
                      >
                        {loadingSubmit && (
                          <svg
                            className='w-5 h-5 mr-3 -ml-1 text-indigo-700 animate-spin'
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
                        Guardar
                      </button>
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
                  const myElemIndex = selectedMedicationsCopy.findIndex(e => elem[el].medicationId == e.medicationId)
  
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