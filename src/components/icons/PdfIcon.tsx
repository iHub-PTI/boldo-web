import React from 'react'


type Props = {
  width?: string;
  height?: string;
  svgClass?: string;
}


const PdfIcon = (props: Props) => {
  const {width=20, height=20, svgClass=""} = props

  return (
    <svg className={svgClass} width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 7.5C9.5 8.33 8.83 9 8 9H7V10.25C7 10.66 6.66 11 6.25 11C5.84 11 5.5 10.66 5.5 10.25V6C5.5 5.45 5.95 5 6.5 5H8C8.83 5 9.5 5.67 9.5 6.5V7.5ZM14.5 9.5C14.5 10.33 13.83 11 13 11H11C10.72 11 10.5 10.78 10.5 10.5V5.5C10.5 5.22 10.72 5 11 5H13C13.83 5 14.5 5.67 14.5 6.5V9.5ZM18.5 5.75C18.5 6.16 18.16 6.5 17.75 6.5H17V7.5H17.75C18.16 7.5 18.5 7.84 18.5 8.25C18.5 8.66 18.16 9 17.75 9H17V10.25C17 10.66 16.66 11 16.25 11C15.84 11 15.5 10.66 15.5 10.25V6C15.5 5.45 15.95 5 16.5 5H17.75C18.16 5 18.5 5.34 18.5 5.75ZM7 7.5H8V6.5H7V7.5ZM1 4C0.45 4 0 4.45 0 5V18C0 19.1 0.9 20 2 20H15C15.55 20 16 19.55 16 19C16 18.45 15.55 18 15 18H3C2.45 18 2 17.55 2 17V5C2 4.45 1.55 4 1 4ZM12 9.5H13V6.5H12V9.5Z" fill="#E53E3E" />
    </svg>
  )
}


export default PdfIcon