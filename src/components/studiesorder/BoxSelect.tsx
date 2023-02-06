import React, { useContext } from 'react'
import SelectItem from './SelectItem'
import {ReactComponent as TemplateStudy } from '../../assets/template-study.svg'
import { CategoriesContext } from './Provider'

const BoxSelect = props => {

    const {style, otherProps} = props

    const {orders, setOrders, setIndexOrder} = useContext(CategoriesContext)
    const data = orders[props.index].studies_codes

    const onClickToogle = () => {
        props.setShow(!props.show)
        setIndexOrder(props.index)
    }

    const deleteData = (index) => {
        data.splice(index, 1)
        const orderUpdate = [...orders]
        orderUpdate[props.index].studies_codes = data
        setOrders(orderUpdate)
    }

    return (
        <div className="flex flex-row flex-wrap bg-white border border-gray-300 rounded items-center"
        style={style}>
            <button className="m-1 p-2 w-auto hover:bg-primary-200 cursor-pointer rounded-full focus:outline-none" onClick={()=>{onClickToogle()}}>
                <TemplateStudy title="Seleccionar estudios"></TemplateStudy>
            </button>
            {data && data.map( (item, i) => {
                return <SelectItem value={item.name} handleDelete={()=>deleteData(i)} {...otherProps}></SelectItem>
            })}
            
        </div>
    )
}

export default BoxSelect;