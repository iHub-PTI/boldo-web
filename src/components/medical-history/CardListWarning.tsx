import axios from 'axios'
import { id } from 'date-fns/locale'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'
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
  callBackAdd: (value: InputValue) => void,
  callBackDel: (id: string) => void,
}

const CardListWarning: React.FC<Props> = ({
  title = '',
  dataList = [],
  backgroundColor = "#FFF3F0",
  url,
  patientId,
  callBackAdd,
  callBackDel,
  ...props
}) => {

  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)

  const Empty = () => {
    if (dataList && dataList.length > 0) return null
    return <span className='text-base leading-6 text-color-disabled italic my-1'
      style={{ letterSpacing: '0.15px' }}
    >
      Ninguno
    </span>
  }

  const handleClickAdd = () => {
    setShowInput(true)
  }

  const requestPostTrhottle = useCallback(
    _.throttle((value: InputValue) => {
      setLoading(true)
      axios
        .post(url, {
          patientId: patientId,
          ...value
        })
        .then(res => {
          callBackAdd(res.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        }).finally(() => setLoading(false))
    }, 1000)
    , [])

  const handleAddList = (value: InputValue) => {
    requestPostTrhottle(value)
  }

  const handleDeleteList = (id: string) => {
    setLoading(true)
    axios
      .delete(url + '/' + id)
      .then(res => {
        callBackDel(id)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      }).finally(() => setLoading(false))
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
        {dataList.map((data, i) => <ItemList key={'card_list_w' + i} description={data.description} date={data.date} deleteItem={() => handleDeleteList(data.id)} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardListWarning