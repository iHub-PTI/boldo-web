import React, { useEffect, useState } from 'react'
import Select from 'react-select'

type OptionType = {
  value: string,
  name: string
}

type Props = {
  data: OptionType[]
  label?: string
  value?: string[]
  drawLine?: number[]
  onChange?: (value: string[]) => void
}

const colorStyle = {
  control: (styles, state) => ({
    ...styles, 
    backgroundColor: 'white',
    //border: state.isFocused ? '1px solid black' : undefined,
    boxShadow: state.isFocused ? '0 0 0 3px rgb(164 202 254 / 45%)' : undefined,
    width: '500px'
  }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused
        ? 'blue'
        : undefined,
      color: isFocused
          ? 'white'
          : 'black',
    };
  },
  multiValue: (styles) => ({...styles, 
    backgroundColor: '#e5edff',
    borderRadius: '9999px',
  }),
  multiValueLabel: (styles,) => ({
    ...styles,
    color: '#42389d',
    fontWeight: '600'
  }),

}

const MultiSelect: React.FC<Props> = ({data, label, value, onChange, drawLine}) => {
  
  const [selected, setSelected] = useState<OptionType[]>([])

  const handleChange = (valueChange) => {
    setSelected(valueChange)
    let temp = valueChange.map((x) => (x.value))
    if(onChange) onChange(temp)
  }

  useEffect(() => {
    if (value){
      let temp = []
      for(let i = 0; i < value.length; i++){
        temp.push(data.find(el => el.value === value[i]))
      }
      setSelected(temp)
    }
  }, [value, data])
  
  return (
    <div>
      <div className='block text-sm font-medium leading-5 text-gray-700 pb-2'>{label}</div>
      <Select
        value={selected}
        getOptionLabel={(x: OptionType) => x.name}
        getOptionValue={(x: OptionType) => x.value}
        isMulti
        options={data}
        onChange={handleChange}
        styles={colorStyle}
      />
    </div>
  )
}

export default MultiSelect
