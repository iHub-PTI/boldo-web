import React from 'react'

export const SelectStudies = ({ template, setTemplate, studies, setStudies }) => {
    return (
        <>
            <div className="flex items-center mr-4">
                <input type="checkbox" value="" className="w-5 h-5"></input>
                    <label className="ml-2 text-sm font-medium">Seleccionar Todo</label>
            </div>
        </>
    )
}