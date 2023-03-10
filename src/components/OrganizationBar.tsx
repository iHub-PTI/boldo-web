import React from 'react'


type Props = {
  orgName: string;
  orgColor: string;
}


const OrganizationBar = (props: Props) => {
  const { orgName, orgColor } = props

  return (
    <div 
      className='flex w-full items-center justify-end'
      style={{ backgroundColor: orgColor }}
    >
      <span className='mt-1 mb-1 mr-4 text-white font-semibold text-base leading-4 tracking-wide'>{orgName}</span>
    </div>
  );
}


export default OrganizationBar