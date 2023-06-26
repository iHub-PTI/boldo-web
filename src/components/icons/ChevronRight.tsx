import * as React from "react"
const ChevronRight = ({ fill = "#424649", width = 20, height = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7 10"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M.793 9.707a1 1 0 0 1 0-1.414L4.086 5 .793 1.707A1 1 0 0 1 2.207.293l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default ChevronRight
