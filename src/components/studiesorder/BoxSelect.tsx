import React, { useState } from 'react'
import SelectItem from './SelectItem'
import {ReactComponent as TemplateStudy } from '../../assets/template-study.svg'

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
            <div className="m-1 p-2 w-auto hover:bg-primary-200 cursor-pointer rounded-full">
                <TemplateStudy></TemplateStudy>
            </div>
            {data && data.map( (item) => {
                return <SelectItem id={item.id} value={item.name} handleDelete={deleteData}></SelectItem>
            })}
        </div>
    )
}

export default BoxSelect;