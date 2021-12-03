import React, { useRef, useEffect, useState } from 'react'

export default function Countdown(props) {
  const { setDataCallback } = props
  const [num, setNum] = useState(5)

  let intervalRef = useRef()

  const decreaseNum = () => setNum(prev => prev - 1)

  useEffect(() => {
    if (num === 0) {
      setDataCallback('send')
    } else {
      intervalRef.current = setInterval(decreaseNum, 1000)
      return () => clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line
  }, [num])

  return (
    <div>
      {num === 0 ? (
        <>
          <p>Habilitado</p>
        </>
      ) : (
        <button
          type='button'
          className='inline-flex items-center px-4 py-2 text-sm font-medium leading-5 text-black transition duration-150 ease-in-out border border-bg-green-200 border-green-200 bg-white rounded-md focus:outline-none focus:shadow-outline-primary focus:border-primary-700 active:bg-primary-100 '
          onClick={() => setDataCallback('cancel')}
        >
          {`Cancelar (${num})`}
        </button>
      )}
    </div>
  )
}
