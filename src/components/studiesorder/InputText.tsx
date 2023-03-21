import { TextField } from '@material-ui/core'
import React, { useState, ChangeEvent, useContext, useEffect } from 'react'
import { CategoriesContext } from './Provider'


const InputText = ({value="", ...props}) => {
  const [text, setText] = useState(props.value ?? '')
  const { orders, setOrders } = useContext(CategoriesContext)

  useEffect(()=>{
    setText(value)
  }, [value])

  const changeText = (event: ChangeEvent<{ value: string }>) => {
    setText(event.target.value)
    props.name === 'diagnosis'
      ? (orders[props.index].diagnosis = event.target.value)
      : (orders[props.index].notes = event.target.value)

    setOrders(orders)
    // console.table(orders)
  }

  return <TextField {...props} onChange={changeText} value={text}></TextField>
}

export default InputText