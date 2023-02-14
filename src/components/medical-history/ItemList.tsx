import React, { useState } from 'react'
import TrashIcon from '../icons/TrashIcon'

type Props = {
  name: string
}

const ItemList: React.FC<Props> = ({ name }) => {

  const [hover, setHover] = useState(false)
  const bgColor = hover ? 'rgba(247, 244, 244, 0.6)' : ''

  return (
    <div className='flex flex-row flex-no-wrap w-full justify-between px-1 h-10 items-center'
      onMouseOver={() => { setHover(true) }}
      onMouseLeave={() => { setHover(false) }}
      style={{
        background: bgColor,
        mixBlendMode: 'multiply',
        borderRadius: '4px'
      }}
    >
      <span className='font-medium text-cool-gray-700'>{name}</span>
      <span>{hover && <TrashIcon />}</span>
    </div>
  )
}

export default ItemList