import React from 'react'


type Props = {
  text: string;
}

const UnderlinedIcon = (props: Props) => {
  const {text} = props

  return(
    <p className='text-xs text-teal-400 underline focus:outline-none'>{text}</p>
  );
};


export default UnderlinedIcon;