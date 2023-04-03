import React, { useEffect, useState } from 'react'
import { useAxiosPost, useAxiosPut } from '../../hooks/useAxios'
import AddCircleIcon from '../icons/AddCircleIcon'
import { WarningIcon } from '../icons/WarningIcon'
import InputAddClose from './InputAddClose'
import ItemList from './ItemList'
import { DataList, InputValue } from './Types'

type Props = {
  title: string,
  dataList: DataList
  backgroundColor?: string
  url: string,
  patientId?: string
  isEditable?: boolean
  handlerSaveLoading?: (value: boolean) => void
}

const CardListWarning: React.FC<Props> = ({
  title = '',
  dataList = [],
  backgroundColor = "#FFF3F0",
  url,
  patientId,
  handlerSaveLoading,
  isEditable = false,
  ...props
}) => {

  const [showInput, setShowInput] = useState(false)
  const [list, setList] = useState<DataList>(dataList)
  const { loading: loadPost, error: errorPost, sendData } = useAxiosPost(url)
  const { loading: loadDel, error: errorDel, updateData } = useAxiosPut(url)

  const Empty = () => {
    if (list && list.length > 0) return null
    return <span className='text-base leading-6 text-color-disabled italic my-1'
      style={{ letterSpacing: '0.15px' }}
    >
      Ninguno
    </span>
  }

  const handleClickAdd = () => {
    setShowInput(true)
  }

 /* TODO: Add support throttle
   const requestPostTrhottle = useCallback(
    _.throttle((value: InputValue) => {
      setLoading(true)
      axios
        .post(url, {
          patientId: patientId,
          ...value
        })
        .then(res => {
          //callBackAdd(res.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        }).finally(() => setLoading(false))
    }, 1000)
    , []) */

  const addItemList = (value: InputValue) => {
    setList([...list, value])
  }

  const removeItemList = (value: InputValue) => {
    setList(list.filter(item => item.id !== value.id))
  }

  const handleAddList = async (value: InputValue) => {
    sendData({ patientId: patientId, description: value.description }, addItemList)
  }

  const handleDeleteList = (id: string) => {
    updateData(id, {}, removeItemList)
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
    <div className='flex flex-col w-full rounded-lg pb-4 group' style={{ backgroundColor: backgroundColor }} {...props}>
      <div className='flex flex-row justify-start gap-2 p-2 font-medium items-center' style={{ color: '#DB7D68' }}>
        <WarningIcon />
        {title}
        <button className='focus:outline-none' onClick={() => { handleClickAdd() }}>
          {isEditable && <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-all duration-500' />}
        </button>
      </div>
      <div className='flex flex-col w-full pr-5 pl-15'>
        <InputAddClose show={showInput} setShow={setShowInput} addInput={handleAddList} />
        {/* {loading && <div className='w-full text-center'>Guardando...</div>} */}
        {list.map((data, i) => <ItemList key={'card_list_w' + i} description={data.description} date={null} deleteItem={() => handleDeleteList(data.id)} isEditable={isEditable} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardListWarning