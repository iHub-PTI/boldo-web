import React from 'react'
import SelectItem from './SelectItem'

const BoxSelect = props => {
    const { options } = props
    return (
        <div className="flex flex-row flex-wrap bg-white border border-gray-300 rounded hover:border-2 hover:border-gray-900 items-center"
        style={{minHeight:'3rem'}}>
            {options && options.map(op => {
                return <SelectItem item={op}></SelectItem>
            })}
        </div>
    )
}

export default BoxSelect;