import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useAxiosDelete, useAxiosPost } from '../../hooks/useAxios'
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
  url?: string
  typeCode?: string,
  categoryCode?: string
  patientId?: string
  organizationId?: string
  handlerSaveLoading?: (value: boolean | null) => void
}

const CardList: React.FC<Props> = ({
  title = '',
  TitleElement = null,
  dataList = [],
  inputTypeWith = undefined,
  url,
  typeCode,
  categoryCode,
  patientId,
  organizationId,
  handlerSaveLoading,
  ...props
}) => {

  const [hover, setHover] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''
  const [list, setList] = useState(dataList)

  const { loading: loadPost, error: errorPost, sendData } = useAxiosPost(url)
  const { loading: loadDel, error: errorDel, deleteData } = useAxiosDelete(url)

  const Empty = () => {
    if (list && list.length > 0) return null
    return <span className='text-base leading-6 text-color-disabled italic pl-2'
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
      performedDate: moment(value.date).format("YYYY-MM-DD"),
      category: categoryCode,
    }, addItemList)
  }

  const handleDeleteList = (id: string) => {
    deleteData(id, removeItemList)
  }

  useEffect(() => {
    if (errorPost) return
    if (errorDel) return
    if (loadDel !== null) handlerSaveLoading(loadDel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDel])

  useEffect(() => {
    if (errorPost) return
    if (errorDel) return
    if (loadPost !== null) handlerSaveLoading(loadPost)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPost])

  useEffect(() => {
    if (errorPost || errorDel) handlerSaveLoading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorPost, errorDel])

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
        {title && <div className='font-normal text-gray-500 text-sm '>{title}</div>}
        {TitleElement && <TitleElement />}
        <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out' />
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
            date={data.date}
            relationship={data.relationship}
            deleteItem={() => handleDeleteList(data.id)}
          />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList