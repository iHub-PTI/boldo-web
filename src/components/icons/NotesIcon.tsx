import * as React from "react"

const NotesIcon = ({ fill = '#000', width = 20, height = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      fillOpacity={0.54}
      d="M18 0H2C.9 0 .01.9.01 2L0 20l4-4h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2ZM6 12H4v-2h2v2Zm0-3H4V7h2v2Zm0-3H4V4h2v2Zm6 6H9c-.55 0-1-.45-1-1s.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1Zm3-3H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1Zm0-3H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1Z"
    />
  </svg>
)
export default NotesIcon