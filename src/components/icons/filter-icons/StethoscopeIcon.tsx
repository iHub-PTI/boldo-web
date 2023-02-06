import React from "react"

const StethoscopeIcon = ({ fill = '#27BEC2', active = false, ...props }) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 1.5V3h1.5v4.5a3 3 0 0 1-6 0V3H15V1.5h-3v6a4.504 4.504 0 0 0 3.75 4.432V16.5a4.5 4.5 0 1 1-9 0v-4.607a3 3 0 1 0-1.5 0V16.5a6 6 0 1 0 12 0v-4.568A4.504 4.504 0 0 0 21 7.5v-6h-3ZM4.5 9a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      fill={active ? fill : '#364152'}
    />
  </svg>
)

export default StethoscopeIcon