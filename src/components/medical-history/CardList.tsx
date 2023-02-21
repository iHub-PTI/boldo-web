import React, { useState } from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import InputAddClose from './InputAddClose'
import ItemList from './ItemList'
import { InputValue } from './Types'

type Props = {
  title: string,
  dataList: { name: string, date?: Date }[]
}

const CardList = ({ title = '', dataList = [] }) => {

  const [list, setList] = useState(dataList)
  const [hover, setHover] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''

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

  const handleAddList = (value: InputValue) => {
    setList([value, ...list])
  }

  const handleDeleteList = (index: number) => {
    let array = [...list]
    array.splice(index, 1)
    setList([...array])
  }

  return (
    <div className='flex flex-col w-full rounded-lg pb-4 px-2 pt-2 group'
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: background
      }}
    >
      <div className='flex flex-row flex-no-wrap font-normal text-gray-500 text-sm pb-1 gap-2 items-center'>
        {title}
        <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          <AddCircleIcon className='opacity-0 group-hover:opacity-100 transition-opacity delay-200 ease-in-out' />
        </button>
      </div>
      <div className='flex flex-col w-full pr-3 pl-2 gap-1'>
        <InputAddClose show={showInput} setShow={setShowInput} addInput={handleAddList} />
        {list.map((data, i) => <ItemList key={'card_list_' + i} name={data.name} date={data.date} deleteItem={() => handleDeleteList(i)} />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList