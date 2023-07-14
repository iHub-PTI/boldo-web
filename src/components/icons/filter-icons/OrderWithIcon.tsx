import * as React from "react"
const OrderWithIcon = ({fill='#27BEC2', active = false, ...props}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={23}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill={active ? fill : '#364152'}
      d="M17.25 10.753V5.175L13.575 1.5H1.5v21h15.75v-.066c2.953-.328 5.25-2.822 5.25-5.84 0-3.019-2.297-5.513-5.25-5.84Zm-3.938-7.678 2.363 2.362h-2.363V3.075Zm-10.5 18.113V2.813H12V6.75h3.938v4.003A6.163 6.163 0 0 0 12.852 12H4.125v1.313h7.547c-.263.393-.46.853-.656 1.312H4.125v1.313h6.628c0 .196-.066.459-.066.656 0 1.837.854 3.543 2.166 4.593H2.813Zm13.782-.066a4.537 4.537 0 0 1-4.528-4.528 4.537 4.537 0 0 1 4.528-4.528 4.537 4.537 0 0 1 4.528 4.528 4.537 4.537 0 0 1-4.528 4.528ZM14.625 9.375h-10.5v1.313h10.5V9.374Z"
    />
    <path
      stroke={active ? fill : '#364152'}
      strokeMiterlimit={10}
      strokeWidth={2}
      d="m14.034 16.266 1.903 2.1 3.347-4.135"
    />
  </svg>
)
export default OrderWithIcon
