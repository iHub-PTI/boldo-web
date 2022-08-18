import React, { useContext } from 'react'
import SelectItem from './SelectItem'
import {ReactComponent as TemplateStudy } from '../../assets/template-study.svg'
import { CategoriesContext } from './Provider'

const BoxSelect = props => {

    const [orders, setOrders] = useContext(CategoriesContext)
    //const { options } = props
    //const [data, setData] = useState(options)
    const data = orders[props.index].studies

    const deleteData = (id) => {
        const dataUpdate = data.filter(item => item.id !== id)
        //setData(dataUpdate)
        const orderUpdate = [...orders]
        orderUpdate[props.index].studies = dataUpdate
        setOrders(orderUpdate)
    }

    return (
        <div className="flex flex-row flex-wrap bg-white border border-gray-300 rounded items-center"
        style={{minHeight:'3rem'}}>
            <div className="m-1 p-2 w-auto hover:bg-primary-200 cursor-pointer rounded-full">
                <TemplateStudy></TemplateStudy>
            </div>
            {data && data.map( (item) => {
                return <SelectItem id={item.id} value={item.name} handleDelete={deleteData} {...props}></SelectItem>
            })}
        </div>
    )
}

export default BoxSelect;