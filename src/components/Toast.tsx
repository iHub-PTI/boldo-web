import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { Transition } from '@headlessui/react'

const Toast: React.FC<{ toast: Toast }> = ({ toast }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 5000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    // Notification panel, show/hide based on alert state.
    <Transition
      show={show}
      appear={true}
      enter='transform ease-out duration-300 transition'
      enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
      enterTo='translate-y-0 opacity-100 sm:translate-x-0'
      leave='transform transition-all ease-in duration-200 overflow-hidden'
      leaveFrom='opacity-100 max-h-200'
      leaveTo='opacity-0 max-h-0'
      className='w-full max-w-sm my-2 bg-white rounded-lg shadow-lg pointer-events-auto'
    >
      <div className='overflow-hidden rounded-lg shadow-xs'>
        <div className='p-4'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <Icon type={toast.type} />
            </div>
            <div className='ml-3 w-0 flex-1 pt-0.5 space-y-1'>
              {toast.title && <p className='text-sm font-medium leading-5 text-gray-900'>{toast.title}</p>}
              {toast.text && <p className='text-sm leading-5 text-gray-500'>{toast.text}</p>}
            </div>
            <div className='flex flex-shrink-0 ml-4'>
              <button
                className='inline-flex text-gray-400 transition duration-150 ease-in-out focus:outline-none focus:text-gray-500'
                onClick={() => setShow(false)}
              >
                {/* Heroicon name: x */}
                <svg className='w-5 h-5' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

interface Toast {
  title?: string
  text?: string
  type: 'success' | 'error' | 'warning' | 'info'
  id: string
}

interface IContext {
  add: (arg: Omit<Toast, 'id'>) => void
}

export const ToastContext = createContext<IContext | null>(null)

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const value = useMemo(
    () => ({
      add: (toast: Omit<Toast, 'id'>) => {
        const id = generateUEID()
        setToasts(toasts => [...toasts, { ...toast, id }])
      },
    }),
    []
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        <div className='fixed inset-0 z-50 flex flex-col-reverse items-center px-4 py-6 pointer-events-none sm:items-end sm:flex-col sm:p-6'>
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export const useToasts = () => {
  const ctx = useContext(ToastContext)

  if (!ctx) {
    throw Error('The `useToasts` hook must be called from a descendent of the `ToastProvider`.')
  }

  return useMemo(
    () => ({
      addToast: ctx.add,
      addErrorToast: (text: string) => {
        ctx.add({ title: 'Error', text: text.toString(), type: 'error' })
      },
    }),
    [ctx]
  )
}

function generateUEID() {
  const first = (Math.random() * 46656) | 0
  const second = (Math.random() * 46656) | 0
  const firstStr = ('000' + first.toString(36)).slice(-3)
  const secondStr = ('000' + second.toString(36)).slice(-3)
  return firstStr + secondStr + '.' + Date.now()
}

const Icon: React.FC<{ type: Toast['type'] }> = ({ type }) => {
  if (type === 'success')
    return (
      // Heroicon name: check-circle
      <svg
        className='w-6 h-6 text-green-400'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    )
  if (type === 'error')
    return (
      <svg
        className='w-6 h-6 text-red-600'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    )
  if (type === 'warning')
    return (
      <svg
        className='w-6 h-6 text-yellow-400'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        />
      </svg>
    )

  return (
    <svg
      className='w-6 h-6 text-blue-600'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  )
}
