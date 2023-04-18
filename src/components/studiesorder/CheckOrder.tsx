import React, { ChangeEvent, useContext } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import { CategoriesContext } from './Provider';



const CheckOrder = props => {

    const {orders, setOrders} = useContext(CategoriesContext)

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        orders[props.index].urgent = event.target.checked
        let update = [...orders]
        setOrders(update)
        //console.table(orders)
    }

    return <Checkbox onChange={handleCheck} name="orden" {...props}/>
}

export default CheckOrder;