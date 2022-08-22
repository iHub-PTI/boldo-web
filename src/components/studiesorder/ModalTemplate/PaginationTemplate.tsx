import React from 'react'
import { ReactComponent as RightIcon } from '../../../assets/pageright.svg'
import { ReactComponent as LeftIcon } from '../../../assets/pageleft.svg' 
import { info } from 'console'

export const PaginationTemplate = ({ page, setPage, maxPagination}) => {
    console.log(page)
    console.log(maxPagination)
  return (
    <div className="flex flex-row">
        <button className="px-3 mx-1 focus:outline-none" onClick={() => {
            if(page - 1 > 0) setPage(page - 1)
        }}>
            <LeftIcon ></LeftIcon>
        </button>
        <button className='px-3 mx-1 focus:outline-none' onClick={()=>{
            if(page + 1 <= maxPagination) setPage(page + 1)
        }}>
            <RightIcon></RightIcon>
        </button>
    </div>
  )
}
