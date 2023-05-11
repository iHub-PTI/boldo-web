import * as React from "react"
const OtherIcon = ({ fill = '#364152', ...props })=> (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <path
      fill={fill}
      fillRule="evenodd"
      d="M0 3a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Zm13 3h-3a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2Zm3.064 22.649L18.557 22H15a1 1 0 0 1 0-2h10.301a1 1 0 1 1 0 2h-2.858l2.493 6.649a1 1 0 1 1-1.872.702l-1.259-3.355h-2.61l-1.259 3.355a1 1 0 1 1-1.872-.702ZM11 13.24h14v-2H11v2Zm5 4.16h-5v-2h5v2Zm4.5 1.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM15 6h6v2h-6V6Z"
      clipRule="evenodd"
    />
  </svg>
)
export default OtherIcon
