import moment from 'moment'
import React, { useState } from 'react'
import TrashIcon from '../icons/TrashIcon'

type Props = {
  name: string,
  date?: Date,
}

const ItemList: React.FC<Props> = ({ name, date }) => {

  const [hover, setHover] = useState(false)
  const bgColor = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  return (
    <div className='flex flex-row flex-no-wrap w-full justify-between px-2 h-10 items-center'
      onMouseOver={() => { setHover(true) }}
      onMouseLeave={() => { setHover(false) }}
      style={{
        background: bgColor,
        mixBlendMode: 'multiply',
        borderRadius: '4px'
      }}
    >
      <span className='font-medium text-cool-gray-700'>{name}</span>
      <span className='flex flex-row flex-no-wrap gap-2 '>
        <span className='font-normal text-sm text-color-disabled'>
          {date && moment(date).format('DD/MM/YYYY')}
        </span>
        {hover &&
          <button className='focus:outline-none'>
            <TrashIcon />
          </button>
        }
      </span>
    </div>
  )
}

export default ItemList