import React, { useState } from 'react'
import SelectItem from './SelectItem'

const BoxSelect = ({ options }) => {

    const [data, setData] = useState(options)

    const deleteData = (id) => {
        console.log(id, 'Eliminando...')
        const dataUpdate = data.filter(item => item.id !== id)
        setData(dataUpdate)
    }

    return (
        <div className="flex flex-row flex-wrap bg-white border border-gray-300 rounded items-center"
        style={{minHeight:'3rem'}}>
            {data && data.map( (item) => {
                return <SelectItem id={item.id} value={item.name} handleDelete={deleteData}></SelectItem>
            })}
        </div>
    )
}

export default BoxSelect;