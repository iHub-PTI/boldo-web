import axios from "axios"
import React from "react"
import Modal from "./Modal"
import { useHistory } from 'react-router-dom'
import { useToasts } from "./Toast"
import handleSendSentry from "../util/Sentry/sentryHelper"
import { ERROR_HEADERS } from "../util/Sentry/errorHeaders"


const CancelAppointmentModal = ({isOpen, setIsOpen,appointmentId}) => {
    const history = useHistory();
    const { addToast } = useToasts();
    return (<Modal show={isOpen} setShow={setIsOpen} size='sm' >
        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
                Cancelar Cita
            </h3>
            <div className='mt-2'>
                <p className='text leading-5 text-gray-500'>¿Estas seguro que quieres cancelar la cita?</p>
            </div>
            <div className='flex justify-end mt-5'>
                <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                    <button
                        type='button'
                        className='inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5'
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        volver
                    </button>
                </span>
                <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
                    <button
                        type='button'
                        className=' inline-flex justify-center  w-full  px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                        onClick={async () => {
                            const url = `/profile/doctor/appointments/cancel/${appointmentId}`
                            try {
                                const res = await axios.post(url)
                                console.log('respuesta ', res)
                                if (res.data != null) {
                                    addToast({ type: 'success', title: 'Cita cancelada con éxito', })
                                    history.replace(`/`)
                                }

                            } catch (err) {
                                const tags = {
                                    "endpoint": url,
                                    "method": "POST",
                                    "appointment-id": `${appointmentId}`
                                }
                                handleSendSentry(err, ERROR_HEADERS.APPOINTMENT.FAILURE_CANCEL, tags)
                                addToast({ 
                                    type: 'error', 
                                    title: 'Ha ocurrido un error.', 
                                    text: 'No fue posible cancelar la cita. ¡Inténtelo nuevamente más tarde!' 
                                })
                            }

                        }}
                    >
                        Confirmar
                    </button>
                </span>
            </div>
        </div>
    </Modal>)


}

export default  CancelAppointmentModal;