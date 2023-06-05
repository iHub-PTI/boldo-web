import React from 'react'

type Props = {
  loadRef: React.MutableRefObject<any>;
}

const RetryRowsData = (props: Props) => {
  const {loadRef} = props

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <p>Hubo un error al cargar los datos.</p>
      <button>
        <p>Reintentar</p>
      </button>
    </div>
  )
}

export default RetryRowsData