import axios from 'axios'
import _, { add } from 'lodash'
import React, { useCallback, useState } from 'react'
import { useAxiosDelete, useAxiosPost } from '../../hooks/useAxios'
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
  patientId: string
}

const CardListWarning: React.FC<Props> = ({
  title = '',
  dataList = [],
  backgroundColor = "#FFF3F0",
  url,
  patientId,
  ...props
}) => {

  const [showInput, setShowInput] = useState(false)
  const [list, setList] = useState<DataList>(dataList)
  const { loading: loadPost, error: ErrorPost, sendData } = useAxiosPost(url)
  const { loading: loadDel, error: ErrorDel, deleteData } = useAxiosDelete(url)

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

  // const requestPostTrhottle = useCallback(
  //   _.throttle((value: InputValue) => {
  //     setLoading(true)
  //     axios
  //       .post(url, {
  //         patientId: patientId,
  //         ...value
  //       })
  //       .then(res => {
  //         //callBackAdd(res.data)
  //         setLoading(false)
  //       })
  //       .catch(err => {
  //         console.error(err)
  //         setLoading(false)
  //       }).finally(() => setLoading(false))
  //   }, 1000)
  //   , [])

  const addItemList = (value: InputValue) => {
    setList([value, ...list])
  }

  const removeItemList = (value: InputValue) => {
    setList(list.filter(item => item.id !== value.id))
  }

  const handleAddList = async (value: InputValue) => {
    sendData({ patientId: patientId, description: value.description }, addItemList)
  }

  const handleDeleteList = (id: string) => {
    deleteData(id, removeItemList)
  }

  return (
    <div className='flex flex-col w-full rounded-lg pb-4 group' style={{ backgroundColor: backgroundColor }} {...props}>
      <div className='flex flex-row justify-start gap-2 p-2 font-medium items-center' style={{ color: '#DB7D68' }}>
        <WarningIcon />
        {title}
        <button className='focus:outline-none' onClick={() => { handleClickAdd() }}>
          <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-all duration-500' />
        </button>
      </div>
      <div className='flex flex-col w-full pr-5 pl-15'>
        <InputAddClose show={showInput} setShow={setShowInput} addInput={handleAddList} />
        {/* {loading && <div className='w-full text-center'>Guardando...</div>} */}
        {list.map((data, i) => <ItemList key={'card_list_w' + i} description={data.description} date={data.date} deleteItem={() => handleDeleteList(data.id)} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardListWarning