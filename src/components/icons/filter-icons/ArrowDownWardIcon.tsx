import React from 'react'

const ArrowDownWardIcon = ({ fill = '#27BEC2', active = false, ...props }) => (
  <svg width={16} height={16} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M7 1v11.17L2.12 7.29c-.39-.39-1.03-.39-1.42 0a.996.996 0 0 0 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 1 0-1.41-1.41L9 12.17V1c0-.55-.45-1-1-1S7 .45 7 1Z'
      fill={active ? fill : '#364152'}
    />
  </svg>
)

export default ArrowDownWardIcon
