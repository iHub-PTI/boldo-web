import { Popover } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { toUpperLowerCase } from "../../util/helpers";
import ArrowDownWardIcon from '../icons/filter-icons/ArrowDownWardIcon';
import ArrowUpWardIcon from '../icons/filter-icons/ArrowUpWardIcon';
import FilterListIcon from '../icons/filter-icons/FilterListIcon';
import OrderWithIcon from '../icons/filter-icons/OrderWithIcon';
import OrderWithoutIcon from '../icons/filter-icons/OrderWithoutIcon';
import PersonIcon from "../icons/filter-icons/PersonIcon";
import StethoscopeIcon from '../icons/filter-icons/StethoscopeIcon';

export const QueryFilter = ({
  currentDoctor = {} as { id: string; name: string; lastName: string },
  getApiCall,
  inputContent,
  setFilterAuthor,
  setFilterOrderStudy,
  setFilterSequence,
  darkMode = false,
}) => {
  //Current Doctor or all Doctors true: current | false: all
  const [author, setAuthor] = useState(false)
  //Asc or Desc [ 'false' || 'true' ]
  const [sequence, setSequence] = useState(true)
  //true withOrder | false withoutOrder | undefined all
  const [orderStudy, setOrderStudy] = useState(undefined)

  const ORDER_STATE = {
    order: true === orderStudy,
    withoutOrder: false === orderStudy,
    all: undefined === orderStudy
  }

  const AUTHOR_STATE = {
    current: true === author,
    all: false === author,
  }

  const SEQUENCE_STATE = {
    asc: false === sequence,
    desc: true === sequence,
  }

  const onClickWithOrder = () => {
    setOrderStudy(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: true,
      inputContent: inputContent
    })
  }

  const onClickWithoutOrder = () => {
    setOrderStudy(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: false,
      inputContent: inputContent
    })
  }

  const onClickAllOrder = () => {
    setOrderStudy(undefined)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withOrder: undefined,
      inputContent: inputContent
    })
  }

  const onClickCurrentDoctor = () => {
    setAuthor(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: true,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickAllDoctor = () => {
    setAuthor(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: false,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickSequenceAsc = () => {
    setSequence(false)
    getApiCall({
      newFirst: false,
      currentDoctorOnly: author,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }

  const onClickSequenceDesc = () => {
    setSequence(true)
    getApiCall({
      newFirst: true,
      currentDoctorOnly: author,
      withOrder: orderStudy,
      inputContent: inputContent
    })
  }
  useEffect(() => {
    setFilterSequence(sequence)
    setFilterAuthor(author)
    setFilterOrderStudy(orderStudy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence, author, orderStudy])

  return (
    <Popover className='relative'>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of the chevron icon. */
        <>
          <Popover.Button className='focus:outline-none' title='Filtros'>
            <FilterListIcon active={open} darkMorde={darkMode} />
          </Popover.Button>
          <Popover.Panel className='absolute left-10 z-10 mt-3 -translate-x-1/2 transform px-4 w-72'>
            <div
              className='flex flex-col bg-blue-100 p-3 rounded-2xl shadow-xl gap-3'
              style={{ backgroundColor: '#EDF2F7' }}
            >
              <div className='flex flex-col'>
                <div className='font-semibold text-gray-500 mb-1'>Estudio Subido</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center justify-center gap-2 cursor-pointer focus:outline-none ${ORDER_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl`}
                    onClick={() => onClickAllOrder()}
                  >
                    <div className={`font-semibold ${ORDER_STATE['all'] && 'text-primary-500'}`}>
                      Todos
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${ORDER_STATE['order'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 focus:outline-none`}
                    onClick={() => onClickWithOrder()}
                  >
                    <OrderWithIcon className='mr-1' active={ORDER_STATE['order']} />
                    <div className={`font-semibold ${ORDER_STATE['order'] && 'text-primary-500'}`}>
                      Con orden asociada
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none rounded-b-2xl ${ORDER_STATE['withoutOrder'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3`}
                    onClick={() => onClickWithoutOrder()}
                  >
                    <OrderWithoutIcon className='mr-1' active={ORDER_STATE['withoutOrder']} />
                    <div className={`font-semibold ${ORDER_STATE['withoutOrder'] && 'text-primary-500'}`}>
                      Sin orden asociada
                    </div>
                  </button>
                </div>
                <div className='font-semibold text-gray-500 mb-1'>Autor</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${AUTHOR_STATE['current'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl focus:outline-none`}
                    onClick={() => onClickCurrentDoctor()}
                  >
                    <PersonIcon className='mr-1' active={AUTHOR_STATE['current']} />
                    <div className={`font-semibold ${AUTHOR_STATE['current'] && 'text-primary-500'}`}>
                      {toUpperLowerCase(currentDoctor.name + ' ' + currentDoctor.lastName)}
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${AUTHOR_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickAllDoctor()}
                  >
                    <StethoscopeIcon className='mr-1' active={AUTHOR_STATE['all']} />
                    <div className={`font-semibold ${AUTHOR_STATE['all'] && 'text-primary-500'}`}>
                      Todos los médicos
                    </div>
                  </button>
                </div>
                <div className='font-semibold text-gray-500 mb-1'>Orden</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['desc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl`}
                    onClick={() => onClickSequenceDesc()}
                  >
                    <ArrowDownWardIcon className='mr-1' active={SEQUENCE_STATE['desc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['desc'] && 'text-primary-500'}`}>
                      Nuevos Primero
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['asc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickSequenceAsc()}
                  >
                    <ArrowUpWardIcon className='mr-1' active={SEQUENCE_STATE['asc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['asc'] && 'text-primary-500'}`}>
                      Antiguos Primero
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}

export const QueryFilterOrder = ({
  currentDoctor = {} as { id: string; name: string; lastName: string },
  getApiCall,
  inputContent,
  setFilterAuthor,
  setFilterWithOrder,
  setFilterSequence,
}) => {
  //Current Doctor or all Doctors true: current | false: all
  const [author, setAuthor] = useState(false)

  //Asc or Desc [ 'false' || 'true' ]
  const [sequence, setSequence] = useState(true)

  //true withResult | false withResult | undefined all
  const [withResult, setWithResult] = useState(undefined)

  const RESULT_STATE = {
    result: true === withResult,
    withoutResult: false === withResult,
    all: undefined === withResult
  }

  const AUTHOR_STATE = {
    current: true === author,
    all: false === author,
  }

  const SEQUENCE_STATE = {
    asc: false === sequence,
    desc: true === sequence,
  }

  const onClickWithResult = () => {
    setWithResult(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withResult: true,
      inputContent: inputContent
    })
  }

  const onClickWithoutResult = () => {
    setWithResult(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withResult: false,
      inputContent: inputContent
    })
  }

  const onClickAllOrder = () => {
    setWithResult(undefined)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: author,
      withResult: undefined,
      inputContent: inputContent
    })
  }

  const onClickCurrentDoctor = () => {
    setAuthor(true)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: true,
      withResult: withResult,
      inputContent: inputContent
    })
  }

  const onClickAllDoctor = () => {
    setAuthor(false)
    getApiCall({
      newFirst: sequence,
      currentDoctorOnly: false,
      withResult: withResult,
      inputContent: inputContent
    })
  }

  const onClickSequenceAsc = () => {
    setSequence(false)
    getApiCall({
      newFirst: false,
      currentDoctorOnly: author,
      withResult: withResult,
      inputContent: inputContent
    })
  }

  const onClickSequenceDesc = () => {
    setSequence(true)
    getApiCall({
      newFirst: true,
      currentDoctorOnly: author,
      withResult: withResult,
      inputContent: inputContent
    })
  }

  useEffect(() => {
    setFilterSequence(sequence)
    setFilterAuthor(author)
    setFilterWithOrder(withResult)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence, author, withResult])

  return (
    <Popover className='relative'>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of the chevron icon. */
        <>
          <Popover.Button className='focus:outline-none' title='Filtros'>
            <FilterListIcon active={open} />
          </Popover.Button>
          <Popover.Panel className='absolute left-10 z-10 mt-3 -translate-x-1/2 transform px-4 w-72'>
            <div
              className='flex flex-col bg-blue-100 p-3 rounded-2xl shadow-xl gap-3'
              style={{ backgroundColor: '#EDF2F7' }}
            >
              <div className='flex flex-col'>
                <div className='font-semibold text-gray-500 mb-1'>Órdenes de estudios</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center justify-center gap-2 cursor-pointer focus:outline-none ${RESULT_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl`}
                    onClick={() => onClickAllOrder()}
                  >
                    <div className={`font-semibold ${RESULT_STATE['all'] && 'text-primary-500'}`}>
                      Todos
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${RESULT_STATE['result'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } pt-3 pl-3 pb-3 focus:outline-none`}
                    onClick={() => onClickWithResult()}
                  >
                    <OrderWithIcon className='mr-1' active={RESULT_STATE['result']} />
                    <div className={`font-semibold ${RESULT_STATE['result'] && 'text-primary-500'}`}>
                      Con resultados añadidos
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none rounded-b-2xl ${RESULT_STATE['withoutResult'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3`}
                    onClick={() => onClickWithoutResult()}
                  >
                    <OrderWithoutIcon className='mr-1' active={RESULT_STATE['withoutResult']} />
                    <div className={`font-semibold ${RESULT_STATE['withoutResult'] && 'text-primary-500'}`}>
                      Sin resultados añadidos
                    </div>
                  </button>
                </div>
                <div className='font-semibold text-gray-500 mb-1'>Autor</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer ${AUTHOR_STATE['current'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl focus:outline-none`}
                    onClick={() => onClickCurrentDoctor()}
                  >
                    <PersonIcon className='mr-1' active={AUTHOR_STATE['current']} />
                    <div className={`font-semibold ${AUTHOR_STATE['current'] && 'text-primary-500'}`}>
                      {toUpperLowerCase(currentDoctor.name + ' ' + currentDoctor.lastName)}
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${AUTHOR_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickAllDoctor()}
                  >
                    <StethoscopeIcon className='mr-1' active={AUTHOR_STATE['all']} />
                    <div className={`font-semibold ${AUTHOR_STATE['all'] && 'text-primary-500'}`}>
                      Todos los médicos
                    </div>
                  </button>
                </div>
                <div className='font-semibold text-gray-500 mb-1'>Orden</div>
                <div className='flex flex-col w-full mb-2'>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['desc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-t-2xl`}
                    onClick={() => onClickSequenceDesc()}
                  >
                    <ArrowDownWardIcon className='mr-1' active={SEQUENCE_STATE['desc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['desc'] && 'text-primary-500'}`}>
                      Nuevos Primero
                    </div>
                  </button>
                  <button
                    className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['asc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
                      } p-3 rounded-b-2xl`}
                    onClick={() => onClickSequenceAsc()}
                  >
                    <ArrowUpWardIcon className='mr-1' active={SEQUENCE_STATE['asc']} />
                    <div className={`font-semibold ${SEQUENCE_STATE['asc'] && 'text-primary-500'}`}>
                      Antiguos Primero
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  )
}