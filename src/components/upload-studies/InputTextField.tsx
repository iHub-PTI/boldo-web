import React from 'react'

type Props = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  id?: string;
  placeholder?: string;
}

const InputTextField = (props: Props) => {
  const { inputText='', setInputText,  id='', placeholder='' } = props

  return (
    <input
      id={id}
      className='px-3 py-2 focus:outline-none border-2 border-solid border-gray-200 rounded-lg text-gray-600 text-lg'
      type='text'
      placeholder={placeholder}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
    />
  )
}

export default InputTextField