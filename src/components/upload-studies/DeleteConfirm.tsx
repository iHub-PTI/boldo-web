import React from 'react'
import Modal from '../Modal'
import CloseIcon from '@material-ui/icons/Close'

type Props = {
  // must be a function that executes the post-delete actions
  confirmDelete: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  msg?: string;
}

const DeleteConfirm = (props: Props) => {
  const {showModal, setShowModal, confirmDelete, msg} = props

  return (
    <Modal show={showModal} setShow={setShowModal} size='md' noPadding={true} >
      <div className='w-full p-6 flex flex-col space-y-4'>
        {/* close icon */}
        <div className='flex flex-row justify-end'>
          <button className='focus:outline-none' onClick={() => setShowModal(false)}>
            <CloseIcon className='focus:outline-none'/>
          </button>
        </div>
        {/* show body message if doesn't empty */}
        <p 
          className='not-italic font-normal text-lg leading-5'
          style={{color: '#364152'}}
        >
            {msg ?? '¿ Está seguro que desea eliminar ?'}
        </p>
        {/* action buttoms */}
        <div className='flex flex-row justify-between'>
          {/* go to back */}
          <button 
            className='flex justify-center items-center box-border p-2 gap-2 rounded-lg focus:outline-none'
            style={{
              border: '2px solid #27BEC2'
            }}
            onClick={() => setShowModal(false)}
          >
            <p
              className='not-italic font-medium text-sm leading-6 focus:outline-none'
              style={{color: '#27BEC2', letterSpacing: '0.15px'}}
            >
              atrás
            </p>
          </button>
          {/* confirm delete */}
          <button
            className='flex justify-center items-center box-border p-2 gap-2 rounded-lg focus:outline-none'
            style={{
              backgroundColor: '#27BEC2'
            }}
            onClick={confirmDelete}
          >
            <p
              className='not-italic font-medium text-base leading-6 text-white'
              style={{letterSpacing: '0.15px'}}
            >
              Sí, eliminar
            </p>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirm