import { TextField } from "@material-ui/core";
import { useEffect } from "react";
import React, { useState, ChangeEvent, useContext } from "react";
import { CategoriesContext } from "./Provider";



const InputText = ({value='', ...props}) => {
    
    const [text, setText] = useState(value)
    const {orders, setOrders} = useContext(CategoriesContext)

    useEffect(()=>{
        if('diagnosis' === props.name){
            orders[props.index].diagnosis = text
            setOrders(orders)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const changeText = (event: ChangeEvent<{ value: string }>) => {
        setText(event.target.value)
        if('diagnosis' === props.name){
            orders[props.index].diagnosis = value
            setOrders(orders)
        }else if('observation' === props.name){
            orders[props.index].notes = event.target.value
            setOrders(orders)
        }
        console.table(orders)
    }
    
    return <TextField {...props} onChange={changeText} value={text}></TextField>
}

export default InputText;