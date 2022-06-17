
import React from "react"
import Modal from "./Modal"
import rotate from '../assets/rotate.gif'

const RotateModal = ({isOpen, setIsOpen}) => {
   
    return (<Modal  show={isOpen} setShow={setIsOpen} size='sm' >
        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-lg font-medium leading-6 text-gray-900' id='modal-headline'>
                Rote su pantalla
            </h3>
            <div className='mt-2'>
                <p className='text leading-5 text-gray-500'>Para una mejor experiencia le recomendamos usar su dispositivo horizontalmente</p>
            </div>
            <img  src={rotate}  alt='loading...' />{' '}
            <div className='flex justify-end mt-5'>
                <span  className='flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:w-auto sm:ml-3'>
                    <button
                    style={{justifyContent:'center'}}
                        type='button'
                        onClick={async () => {
                            setIsOpen(false)

                        }}
                        className=' inline-flex items-center  w-full  px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-700'
                    >
                        Continuar
                    </button>
                </span>
            </div>
        </div>
    </Modal>)


}

export default  RotateModal;