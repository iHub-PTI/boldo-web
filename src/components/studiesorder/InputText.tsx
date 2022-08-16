import { TextField } from "@material-ui/core";
import React, { useState, ChangeEvent } from "react";



const InputText = props => {
    const [text, setText] = useState("")

    const changeText = (event: ChangeEvent<{ value: string }>) => {
        setText(event.target.value)
        console.log(event.target.value)
    }
    

    return <TextField {...props} onChange={changeText} value={text}></TextField>
}

export default InputText;