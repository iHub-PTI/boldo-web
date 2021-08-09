import React, { useRef, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import ReactDOM from 'react-dom'

const sizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  xl2: 'sm:max-w-2xl',
  xl3: 'sm:max-w-3xl',
  xl4: 'sm:max-w-4xl',
  xl5: 'sm:max-w-5xl',
  full: 'max-w-full',
}

interface Props {
  show: boolean
  setShow: (arg0: boolean) => void
  size: keyof typeof sizes
  noPadding?: boolean
}

const portal = document.getElementById('portal')

const Modal: React.FC<Props> = props => {
  const { show, setShow } = props

  const container = useRef<HTMLDivElement>(null)

  // Allow for outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        if (!show) return
        setShow(false)
      }
    }

    window.addEventListener('click', handleOutsideClick, true)
    return () => window.removeEventListener('click', handleOutsideClick, true)
  }, [show, setShow])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (!show) return

      if (event.key === 'Escape') {
        setShow(false)
      }
    }

    document.addEventListener('keyup', handleEscape)
    return () => document.removeEventListener('keyup', handleEscape)
  }, [show, setShow])

  let size = sizes[props.size]

  return ReactDOM.createPortal(
    <Transition show={show} className='absolute inset-0 z-40 flex'>
      <div className='fixed inset-0 z-10 overflow-y-auto'>
        <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block md:px-8'>
          {/* Background overlay, show/hide based on modal state.*/}
          <Transition.Child
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            className='fixed inset-0 transition-opacity'
          >
            <div className='absolute inset-0 bg-gray-500 opacity-75' />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen' />​
          {/* Modal panel, show/hide based on modal state.*/}
          <Transition.Child
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            className={`${
              props.noPadding ? '' : 'px-4 pt-5 pb-4 sm:p-6'
            } ${size} inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle w-full`}
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
          >
            <div ref={container}>{props.children}</div>
          </Transition.Child>
        </div>
      </div>
    </Transition>,
    portal as Element
  )
}

export default Modal
