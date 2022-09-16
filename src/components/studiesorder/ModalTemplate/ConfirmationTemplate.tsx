import React from "react"
import Modal from "../../Modal"
import { ReactComponent as Spinner } from '../../../assets/spinner.svg'

const ConfirmationTemplate = ({isOpen, setIsOpen, title, message, callBack=()=>{}, loading}) => {
    
    return (<Modal show={isOpen} setShow={setIsOpen} size='sm' >
        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
                {title}
            </h3>
            <div className='mt-2'>
                <p className='text leading-5 text-gray-500'>{message}</p>
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
                        Volver
                    </button>
                </span>
                <span className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
                    <button
                        type='button'
                        onClick={() => {
                            callBack()
                        }}
                        className=' inline-flex items-center  w-full  px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                    >
                        {loading ? <Spinner /> : ''}
                        Confirmar
                    </button>
                </span>
            </div>
        </div>
    </Modal>)


}

export default  ConfirmationTemplate;