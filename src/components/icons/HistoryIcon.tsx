import * as React from "react"

const PastIcon = ({fill="#6B7280", ...props}) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m2.014 7.417 4.62-4.59a.496.496 0 0 1 .7.002.496.496 0 0 1-.002.7L2.71 8.118l2.018.01a.493.493 0 1 1-.004.986l-3.21-.01a.493.493 0 0 1-.492-.495l.011-3.21a.493.493 0 1 1 .986.003l-.006 2.014ZM12 3.001h8c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2Zm.5 8h7c.28 0 .5-.22.5-.5V7h-8v3.5c0 .28.22.5.5.5ZM6 9c0-.55.45-1 1-1s1 .45 1 1v6h8c.55 0 1 .45 1 1s-.45 1-1 1H8c-1.1 0-2-.9-2-2V9Zm-3 3c-.55 0-1 .45-1 1v6c0 1.1.9 2 2 2h8c.55 0 1-.45 1-1s-.45-1-1-1H4v-6c0-.55-.45-1-1-1Z"
      fill={fill}
    />
  </svg>
)

export default PastIcon