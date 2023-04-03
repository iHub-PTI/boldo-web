import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useAxiosPost, useAxiosPut } from '../../hooks/useAxios'
import AddCircleIcon from '../icons/AddCircleIcon'
import InputAddClose from './InputAddClose'
import InputTextDate from './InputTextDate'
import InputTextHereditary from './InputTextHereditary'
import ItemList from './ItemList'
import { DataList, InputValue } from './Types'

type Props = {
  title?: string,
  TitleElement?: () => JSX.Element
  dataList: DataList
  inputTypeWith?: "date" | "relationship" | undefined
  typeCode?: string,
  darkMode?: boolean
  url?: string
  categoryCode?: string
  patientId?: string
  organizationId?: string
  isEditable?: boolean
  handlerSaveLoading?: (value: boolean | null) => void
}

/**
 * CardList Component
 *
 * Displays a list of cards based on a data list.
 *
 * @param {string} title - The title of the card list.
 * @param {React.ElementType} TitleElement - The element to use as the title of the card list.
 * @param {Array} dataList - The list of data to display as cards.
 * @param {string} inputTypeWith - The input type to use for the card list (optional). "date" | "relationship" | undefined
 * @param {string} url - The URL to fetch the data list from.
 * @param {string} typeCode - The code that corresponds to the type of section
 * @param {boolean} darkMode - Whether to display the card list in dark mode (optional).
 * @param {string} categoryCode - The category of data to display in the card list.
 * @param {string} patientId - The ID of the patient to display data 
 * @param {string} organizationId - The ID of the organization to display data
 * @param {function} handlerSaveLoading - The function to handle saving/loading (optional).
 * @param {boolean} isEditable - to restrict editing
 * @param {...any} props - Additional props to pass to the component.
 *
 * @returns {JSX.Element} - The CardList component.
 */

const CardList: React.FC<Props> = ({
  title = '',
  TitleElement = null,
  dataList = [],
  inputTypeWith = undefined,
  url,
  typeCode,
  darkMode = false,
  categoryCode,
  patientId,
  organizationId,
  handlerSaveLoading,
  isEditable = false,
  ...props
}) => {

  const [hover, setHover] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''
  const classTitle = darkMode ? 'font-normal text-pressed-gray text-sm group-hover:text-dark-cool'
    : 'font-normal text-gray-500 text-sm'

  const [list, setList] = useState(dataList)

  const { loading: loadPost, error: errorPost, sendData } = useAxiosPost(url)
  const { loading: loadPut, error: errorPut, updateData } = useAxiosPut(url)

  const Empty = () => {

    let classEmpty = darkMode ? 'text-base leading-6 text-gray-200 group-hover:text-dark-cool italic pl-2' :
      'text-base leading-6 text-color-disabled italic pl-2'
    if (list && list.length > 0) return null
    return <span className={classEmpty}
      style={{ letterSpacing: '0.15px' }}
    >
      Ninguno
    </span>
  }

  const handleClickAdd = () => {
    setShowInput(true)
  }

  const addItemList = (value: InputValue) => {
    setList([...list, value])
  }

  const removeItemList = (value: InputValue) => {
    setList(list.filter(item => item.id !== value.id))
  }

  const handleAddList = (value: InputValue) => {
    sendData({
      patientId,
      organizationId,
      description: value.description,
      //can be performedDate or OnSetDate depending on the component and if it admits date
      ...(value.date && inputTypeWith === 'date' && {performedDate: moment(value.date).format("YYYY-MM-DD")}),
      ...(value.date && inputTypeWith === 'date' && {onSetDate: moment(value.date).format("YYYY-MM-DD")}),
      type: typeCode,
      category: categoryCode,
      relationship: value.relationship
    }, addItemList)
  }

  const handleDeleteList = (id: string) => {
    updateData(id, undefined, removeItemList)
  }


  useEffect(() => {
    if (errorPost || errorPut) return
    if (loadPost !== null) handlerSaveLoading(loadPost)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPost])

  useEffect(() => {
    if (errorPost || errorPut) return
    if (loadPut !== null) handlerSaveLoading(loadPut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPut])

  useEffect(() => {
    if (errorPost || errorPut) handlerSaveLoading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorPost, errorPut])

  return (
    <div className='flex flex-col w-full rounded-lg pb-4 px-2 pt-2 group'
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: background
      }}
      {...props}
    >
      <div className='flex flex-row flex-no-wrap pb-1 gap-2 items-center'>
        {title && <div className={classTitle}>{title}</div>}
        {TitleElement && <TitleElement />}
        <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          {isEditable &&
            <AddCircleIcon fill={darkMode ? '#FFFFFF' : '#27BEC2'} className='opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out' />
          }
        </button>
      </div>
      <div className='flex flex-col w-full pr-3 pl-2 gap-1'>
        {!inputTypeWith &&
          <InputAddClose show={showInput} setShow={setShowInput} addInput={handleAddList} />}
        {inputTypeWith === 'date' &&
          <InputTextDate show={showInput} setShow={setShowInput} addInput={handleAddList} />
        }
        {inputTypeWith === 'relationship' &&
          <InputTextHereditary show={showInput} setShow={setShowInput} addInput={handleAddList} />
        }
        {list.map((data, i) =>
          <ItemList
            key={'card_list_' + i}
            description={data.description}
            date={inputTypeWith === 'relationship' || inputTypeWith === undefined ? undefined : data.performedDate || data.onSetDate}
            relationship={data.relationship}
            darkMode={darkMode}
            deleteItem={() => handleDeleteList(data.id)}
            isEditable={isEditable}
          />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList