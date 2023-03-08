import React, { Dispatch, useState } from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import { WarningIcon } from '../icons/WarningIcon'
import InputAddClose from './InputAddClose'
import ItemList from './ItemList'
import { DataList, InputValue } from './Types'

type Props = {
  title: string,
  dataList: DataList
  backgroundColor?: string
  typeCode: string,
  dispatch: Dispatch<any>
}

const CardList: React.FC<Props> = ({
  title = '',
  dataList = [],
  backgroundColor = "#FFF3F0",
  typeCode,
  dispatch,
  ...props
}) => {

  const [showInput, setShowInput] = useState(false)

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

  const handleAddList = (value: InputValue) => {
    let type = typeCode + '_add'
    dispatch({ type: type, value: value })
  }

  const handleDeleteList = (id: string) => {
    let type = typeCode + '_del'
    dispatch({ type: type, id: id })
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
        {dataList.map((data, i) => <ItemList key={'card_list_w' + i} description={data.description} date={data.date} deleteItem={() => handleDeleteList(data.id)} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList