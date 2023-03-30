import React from "react"


type Props = {
  width?: string;
  height?: string;
  currentColor?: string;
}


const CheckWithoutBackground = (props: Props) => {
  const {width="24", height="24", currentColor="white"} = props

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.00014 16.1703L5.53014 12.7003C5.14014 12.3103 4.51014 12.3103 4.12014 12.7003C3.73014 13.0903 3.73014 13.7203 4.12014 14.1103L8.30014 18.2903C8.69014 18.6803 9.32014 18.6803 9.71014 18.2903L20.2901 7.71031C20.6801 7.32031 20.6801 6.69031 20.2901 6.30031C19.9001 5.91031 19.2701 5.91031 18.8801 6.30031L9.00014 16.1703Z" fill={currentColor}/>
    </svg>
  );
}


export default CheckWithoutBackground