import * as React from "react"
const PictureIcon = ({ fill = "#364F6B", width = 23, height = 23, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 19 18"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      d="M16.5 0h-14C1.4 0 .5.9.5 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2Zm-1 16h-12c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1Zm-4.44-6.19-2.35 3.02-1.56-1.88a.5.5 0 0 0-.78.01l-1.74 2.23a.5.5 0 0 0 .39.81H14a.5.5 0 0 0 .4-.8l-2.55-3.39a.498.498 0 0 0-.79 0Z"
    />
  </svg>
)
export default PictureIcon