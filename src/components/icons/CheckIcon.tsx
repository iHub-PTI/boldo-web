import React from 'react'

const CheckIcon = ({ active = false, ...props }) => (
  <svg width={18} height={13} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M6 10.17 2.53 6.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L17.29 1.71A.996.996 0 1 0 15.88.3L6 10.17Z'
      fill={active ? '#27BEC2' : '#E0DEDE'}
    />
  </svg>
)

export default CheckIcon
