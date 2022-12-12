import React from 'react'

const ArrowDown = ({fill='#000', ...props}) => (
  <svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z' fill={fill} fillOpacity={0.54} />
  </svg>
)

export default ArrowDown
