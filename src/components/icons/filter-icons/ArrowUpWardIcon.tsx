import React from 'react'

const ArrowUpWardIcon = ({ fill = '#27BEC2', active = false, ...props }) => (
  <svg width={16} height={16} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M9 15V3.83l4.88 4.88c.39.39 1.03.39 1.42 0a.996.996 0 0 0 0-1.41L8.71.71a.996.996 0 0 0-1.41 0L.7 7.29A.996.996 0 1 0 2.11 8.7L7 3.83V15c0 .55.45 1 1 1s1-.45 1-1Z'
      fill={active ? fill : '#364152'}
    />
  </svg>
)

export default ArrowUpWardIcon
