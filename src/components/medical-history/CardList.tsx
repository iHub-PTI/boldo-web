import React, { Dispatch, useState } from 'react'
import AddCircleIcon from '../icons/AddCircleIcon'
import InputAddClose from './InputAddClose'
import InputTextDate from './InputTextDate'
import InputTextHereditary from './InputTextHereditary'
import ItemList from './ItemList'
import { DataList, InputValue } from './Types'

type Props = {
  title?: string,
  TitleElement?: () => JSX.Element,
  dataList: DataList
  inputTypeWith?: "date" | "relationship" | undefined
  typeCode: string,
  darkMode?: boolean
}

const CardList: React.FC<Props> = ({
  title = '',
  TitleElement = null,
  dataList = [],
  inputTypeWith = undefined,
  typeCode,
  darkMode = false,
  ...props
}) => {

  const [hover, setHover] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const background = hover ? 'rgba(247, 244, 244, 0.6)' : ''
  const classTitle = darkMode ? 'font-normal text-pressed-gray text-sm group-hover:text-dark-cool'
    : 'font-normal text-gray-500 text-sm'

  const [list, setList] = useState(dataList)

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

  const handleAddList = (value: InputValue) => {
    console.log(value)
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
      {...props}
    >
      <div className='flex flex-row flex-no-wrap pb-1 gap-2 items-center'>
        {title && <div className={classTitle}>{title}</div>}
        {TitleElement && <TitleElement />}
        <button className='focus:outline-none' onClick={() => handleClickAdd()}>
          <AddCircleIcon fill={darkMode ? '#FFFFFF': '#27BEC2'} className='opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out' />
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
            deleteItem={() => handleDeleteList(i)}
            darkMode={true}
          />)}
        <Empty />
      </div>
    </div>
  )
}

export default CardList