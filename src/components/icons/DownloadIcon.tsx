import React from 'react'


type Props = {
  width?: string;
  height?: string
}

const DownloadIcon = (props: Props) => {
  const {width='15', height='15'} = props

  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 13V14C1 14.7956 1.31607 15.5587 1.87868 16.1213C2.44129 16.6839 3.20435 17 4 17H14C14.7956 17 15.5587 16.6839 16.1213 16.1213C16.6839 15.5587 17 14.7956 17 14V13M13 9L9 13M9 13L5 9M9 13V1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


export default DownloadIcon