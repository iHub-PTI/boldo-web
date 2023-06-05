import React from 'react'

type Props = {
  loadRef: React.MutableRefObject<any>;
}

const RetryRowsData = (props: Props) => {
  const {loadRef} = props

  const handleClick = () => {
    if (!loadRef) return
    loadRef.current?.onQueryChange()
  }

  return (
    <div className='w-full h-full flex flex-col space-y-3 items-center justify-center'>
      <p className='not-italic font-semibold text-base leading-5'>Hubo un error al cargar los datos.</p>
      <button
        className='rounded-lg focus:outline-none'
        style={{
          backgroundColor: '#27BEC2'
        }}
        onClick={handleClick}
      >
        <p className='px-1 py-2 not-italic font-semibold text-base leading-5 text-white'>
          Reintentar
        </p>
      </button>
    </div>
  )
}

export default RetryRowsData