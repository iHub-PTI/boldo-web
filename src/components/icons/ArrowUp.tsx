import React from 'react'

type Props = {
  width?: string;
  height?: string;
  fill?: string;
  fillOpacity?: string;
}

const ArrowUp = (props: Props) => {
  const { width='24', height='24', fill='black', fillOpacity='0' } = props

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.12 14.7105L12 10.8305L15.88 14.7105C16.27 15.1005 16.9 15.1005 17.29 14.7105C17.68 14.3205 17.68 13.6905 17.29 13.3005L12.7 8.71047C12.31 8.32047 11.68 8.32047 11.29 8.71047L6.7 13.3005C6.31 13.6905 6.31 14.3205 6.7 14.7105C7.09 15.0905 7.73 15.1005 8.12 14.7105Z" fill={fill} fillOpacity={fillOpacity} />
    </svg>
  )
}

export default ArrowUp