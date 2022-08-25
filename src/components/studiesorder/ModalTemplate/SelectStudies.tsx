
import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { StudyIndication } from './StudyIndication';

const CheckStyle = styled.input.attrs({ type: 'checkbox' })`
    accent-color:#13A5A9;
`

export const SelectStudies = ({ template, setTemplate }) => {
    const [selectAll, setSelectAll] = useState(false)

    const handleSelectAll = () => {
        console.log(selectAll)
        setSelectAll(!selectAll)
        const dataCopy = {...template}
        dataCopy.studiesIndication.forEach(element => {
            element.select = !selectAll
        });
        setTemplate(dataCopy)
    }

    const selectCheck = (id) => {
        template.studiesIndication[id].select =  !template.studiesIndication[id].select
        if(template.studiesIndication[id].select === false){
            template.studiesIndication[id].indication = ''
        }
        let copyTemplate = {...template}
        setTemplate(copyTemplate)
    }

    const updateIndication = (indication,id) => {
        template.studiesIndication[id].select =  true
        template.studiesIndication[id].indication =  indication
        let copyTemplate = {...template}
        setTemplate(copyTemplate)
    }

    useEffect(()=>{
        if(template !== undefined){
            let data = [...template.studiesIndication]
            if(data.length === 0) return
            let yesAll = true
            for (let i = 0; i < data.length; i++) {
                if(data[i].select === false){
                    yesAll = false
                    setSelectAll(false)
                    return
                }
            }
            if(yesAll) setSelectAll(true)
        }
    },[template])

    return (
        <>
            <div className="flex items-center mr-4">
                <CheckStyle checked={selectAll} className="w-5 h-5" onClick={handleSelectAll}></CheckStyle>
                <label className="ml-2 text-sm font-medium">Seleccionar Todo</label>
            </div>
            <div className="mt-1 pl-8 pb-2 flex flex-row flex-wrap w-full overflow-y-auto" style={{ height:"250px", maxHeight: '580px' }}>
                {
                    template.studiesIndication.map((data, i) => (
                        <StudyIndication id={i} name={data.name} indication={data.indication} check={data.select} selectCheck={selectCheck} setIndication={updateIndication} disabled={!data.select} />

                    ))
                }
                {console.table(template.studiesIndication)}
            </div>

        </>
    )
}