import React from 'react'
import styled from 'styled-components'

const Check = styled.input.attrs({ type: 'checkbox' })`
    accent-color: #13A5A9;
`

export const StudyIndication = ({ id, name, indication, check=false, disabled=true, disabledCheck=false, selectCheck=(id?:any)=>{},setIndication=(indication?:String,id?:any)=>{}, className="p-1 w-72 m-2 h-auto"}) => {
    return (
        <div className={className} id={id}>
            <div className="flex items-center mr-4">
                <Check className="h-5 w-5" checked={check} disabled = {disabledCheck}
                    onClick={()=>{
                        selectCheck(id)
                    }}
                />
                <label className="ml-2 w-full">{name}</label>
            </div>
            <h6 className='mt-1 text-sm'>Indicaciones</h6>
            <input type="text" 
            value={indication}
            onChange={e => {
            setIndication(e.target.value,id)
          }} className="mt-2 p-1 w-full h-8 outline-none disabled:bg-gray-300 disabled:cursor-default rounded-md border border-gray-400 text-sm" disabled={disabled}/>
        </div>
    )
}
