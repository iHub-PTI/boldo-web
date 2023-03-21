import React from 'react'


type Props = {
  items: number
  fromVirtual?: boolean
}


/**
 * @param {number} items - number we'll show into the circular div
 * @return JSX component that will display a number inside a colored circle
 */
const CircleCounter = (props: Props) => {
  const { items=0, fromVirtual=false } = props

  return(
    // only show when items > 0
    items > 0
      ? <div 
          className={`flex rounded-full items-center justify-center text-white absolute transform ${fromVirtual ? 'w-5 h-5 translate-x-4 translate-y-4' : 'w-7 h-7 translate-x-5 translate-y-5'}`}
          style={{
            backgroundColor: "#27BEC2"
          }}
        >
        <p className={`font-bold leading-3 ${fromVirtual ? 'text-xs' : 'text-base'}`}>{items}</p>
      </div>
      : <></>
  )
}


export default CircleCounter;