import { TextField } from '@material-ui/core'
import React, { useState, ChangeEvent, useContext } from 'react'
import { CategoriesContext } from './Provider'


const InputText = props => {
  const [text, setText] = useState(props.value ?? '')
  const { orders, setOrders } = useContext(CategoriesContext)

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