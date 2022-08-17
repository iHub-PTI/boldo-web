import React, { useState, ChangeEvent } from 'react';

import Checkbox from '@material-ui/core/Checkbox';



const CheckOrder = props => {

    const { checked } = props;

    const [checkOrder, setCheckOrder] = useState(checked)

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckOrder(event.target.checked)
        console.log(checkOrder)
    }
    return <Checkbox checked={checkOrder} onChange={handleCheck} name="orden" {...props}/>
}

export default CheckOrder;