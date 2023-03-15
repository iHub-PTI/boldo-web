import React from 'react'


type Props = {
  width?: string;
  height?: string;
  currentColor?: string;
}


const PrescriptionSelect = (props: Props) => {
  const {width="24", height="24", currentColor="#364152"} = props

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.80626 19.2312C2.81458 17.2396 2.81458 14.0104 4.80626 12.0187L12.0187 4.80626C14.0104 2.81458 17.2396 2.81458 19.2312 4.80626C21.2229 6.79793 21.2229 10.0271 19.2312 12.0187L12.0187 19.2312C10.0271 21.2229 6.79793 21.2229 4.80626 19.2312ZM6.393 13.6055L13.6055 6.393C14.7208 5.27767 16.5291 5.27767 17.6445 6.393C18.7598 7.50834 18.7598 9.31666 17.6445 10.432L14.2034 13.8731L11.4623 11.132L5.80414 16.7901C5.33562 15.7407 5.53191 14.4666 6.393 13.6055Z" fill={currentColor}/>
    </svg>
  );
}


export default PrescriptionSelect