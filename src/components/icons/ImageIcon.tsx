import React from 'react'


type Props = {
  width?:     string;
  height?:    string;
  svgClass?:  string;
}

const ImageIcon = (props: Props) => {
  const {width="18", height="18", svgClass=""} = props

  return(
    <svg className={svgClass} width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 9.25C10.24 9.25 11.25 8.24 11.25 7C11.25 5.76 10.24 4.75 9 4.75C7.76 4.75 6.75 5.76 6.75 7C6.75 8.24 7.76 9.25 9 9.25ZM13.5 13.25C13.5 11.75 10.5 11 9 11C7.5 11 4.5 11.75 4.5 13.25V14H13.5V13.25ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM15 16H3C2.45 16 2 15.55 2 15V3C2 2.45 2.45 2 3 2H15C15.55 2 16 2.45 16 3V15C16 15.55 15.55 16 15 16Z" fill="#3182CE" />
    </svg>
  )
}


export default ImageIcon