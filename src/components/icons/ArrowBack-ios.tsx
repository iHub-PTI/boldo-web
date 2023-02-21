import React from "react"

const ArrowBackIOS = ({fill='#27BEC2', ...props}) => (
  <svg
    width={11}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.62.989a1.25 1.25 0 0 0-1.77 0L.54 9.299a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77l-7.24-7.25 7.25-7.25c.48-.48.48-1.28-.01-1.76Z"
      fill={fill}
    />
  </svg>
)

export default ArrowBackIOS