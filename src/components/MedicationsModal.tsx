import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Modal from './Modal'

export default function MedicationsModal({
  showEditModal,
  setShowEditModal,
  setDataCallback,
  selectedMedicaitonsState,
}: {
  showEditModal: boolean
  setShowEditModal: any
  setDataCallback: any
  selectedMedicaitonsState: any
}) {
  const [searchValue, setSeachValue] = useState<any>('')
  const [medicationItems, setMedicationsItems] = useState<any>([])
  const [medicationsLoading, setMedicationsLoading] = useState<boolean>(true)
  const [selectedMedications, setSelectedMedications] = useState<any[]>(selectedMedicaitonsState)
  const [showError, setShowError] = useState<boolean>(false)

  const debounce = useCallback(
    _.debounce((_searchVal: string) => {
      fetchData(_searchVal)
      // send the server request here
    }, 300),
    []
  )

  useEffect(() => {
    if (showEditModal) {
      fetchData('')
      setSelectedMedications(selectedMedicaitonsState)
    } else {
      setSeachValue('')
      setMedicationsItems([])
      setSelectedMedications([])
    }
    // eslint-disable-next-line
  }, [showEditModal])

  async function fetchData(content: string) {
    try {
      setShowError(false)
      setMedicationsLoading(true)
      const res = await axios.get(`/profile/doctor/medications${content ? `?content=${content}` : ''} `)

      setMedicationsItems(res.data.items)
      setMedicationsLoading(false)
    } catch (err) {
      console.log(err)
      setShowError(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDataCallback(selectedMedications)
    showEditModal = false
  }

  return (
    <Modal show={showEditModal} setShow={setShowEditModal} size='full'>
      <div className='col-span-6 mb-6 sm:col-span-3'>
        <label htmlFor='search' className='block text-sm font-medium leading-5 text-gray-700'>
          Buscar Medicamentos
        </label>
        <input
          id='search'
          className='block w-full px-3 py-2 mt-1 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm form-input focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5'
          onChange={e => {
            setSeachValue(e.target.value)
            debounce(e.target.value)
          }}
          value={searchValue}
          type='text'
        />
      </div>

      <div className='flex flex-col max-height-60'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            <div className='overflow-hidden border-b border-gray-200 shadow sm:rounded-lg'>
              {medicationsLoading ? (
                <div className='flex flex-col items-center justify-center h-full py-16'>
                  <div>Cargando...</div>
                </div>
              ) : medicationItems.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full py-16'>
                  <div>No se encontró ningun medicamento.</div>
                </div>
              ) : showError ? (
                <div className='flex flex-col items-center justify-center h-full py-16 text-red-700'>
                  <div>Algo salió mal, vuelve a intentarlo mas tarde.</div>
                </div>
              ) : (
                <table className='break-normal md:break-all table-fixed '>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th scope='col' className='relative px-6 py-3'>
                        <span className='sr-only'>Edit</span>
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                      >
                        Principio Activo
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                      >
                        Nombre Comercial
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                      >
                        Laboratorio
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
                      >
                        Presentación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationItems.map((medication: any, medicationIdx: any) => (
                      <tr key={medication.id} className={medicationIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-6 py-4 text-sm font-medium text-right whitespace-nowrap'>
                          <div className='flex items-center h-5'>
                            <input
                            onChange={e => {}}
                              id='medication'
                              aria-describedby='medication-description'
                              name='medication'
                              type='checkbox'
                              checked={selectedMedications.some(e => e.medicationId === medication.id)}
                              onClick={() => {
                                let medicationAlreadyExists = selectedMedications.find(
                                  (e: any) => e.medicationId === medication.id
                                )
                                if (medicationAlreadyExists) {
                                  //remove medications
                                  let medicationsCopy = [...selectedMedications]
                                  medicationsCopy = medicationsCopy.filter((e: any) => e.medicationId !== medication.id)

                                  setSelectedMedications(medicationsCopy)
                                } else {
                                  //add medication

                                  setSelectedMedications([
                                    ...selectedMedications,
                                    { medicationId: medication.id, medicationName: medication.name, instructions: '' , status:'active',form: medication.form},
                                  ])
                                }
                              }}
                              className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                            />
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {medication.ingredients}
                        </td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {medication.name}
                        </td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {medication.manufacturer}
                        </td>
                        <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                          {medication.form}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={e => handleSubmit(e)}>
        <div className='flex w-full jusitfy-end'>
          <div className='mt-6 ml-auto sm:flex'>
            <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
              <button
                type='button'
                className='inline-flex justify-center w-full px-4 pt-3 pb-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'
                onClick={() => {
                  setShowEditModal(false)
                }}
              >
                Cancelar
              </button>
            </span>
            <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
              <button
                type='submit'
                className='inline-flex justify-center w-full px-4 pt-3 pb-2 text-base font-medium leading-6 text-indigo-700 transition duration-150 ease-in-out bg-indigo-100 border-gray-300 rounded-md shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200'
              >
                Guardar
              </button>
            </span>
          </div>
        </div>
      </form>
    </Modal>
  )
}
