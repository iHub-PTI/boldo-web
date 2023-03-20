import React from 'react'
import InfoIcon from '../icons/info-icons/InfoIcon';


type Props = {
  backgorundColor?: string;
}


const TooltipInfo = (props: Props) => {
  const {backgorundColor="#364152"} = props

  return(
    // all the tooltip
    <div 
      className={`flex flex-row w-80 h-auto p-4 gap-3 absolute rounded-tl-lg rounded-br-lg rounded-bl-lg transform`}
      style={{ background: backgorundColor, translate: "-20rem", marginTop: "1.5rem", zIndex:100 }}
    >
      {/* this is the icon on left */}
      <div className='h-full w-1/12 justify-center'>
        <InfoIcon circularColor='#FFFFFF'/>
      </div>
      {/* this is the space for text info */}
      <div className='flex flex-col h-auto w-11/12 text-white text-sm'>
        <p>Podés editar el diagnósitco para dar</p>
        <p>mejor contexto.</p>
        <p>Esto no altera el diagnóstico</p>
        <p>consignado en el registro</p>
        <p>ambulatorio.</p>
      </div>
    </div>
  )
}


export default TooltipInfo