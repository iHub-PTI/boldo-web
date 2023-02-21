import  React from "react"

const NoProfilePicture = ({fill='#FFF', ...props}) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0 1 12.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill={fill} />
  </svg>
)

export default NoProfilePicture