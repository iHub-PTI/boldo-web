import React, { createContext, useState } from 'react';


type OrderImportedContextType = {
  OrderImported: Boldo.OrderStudy;
  setOrderImported: (value: Boldo.OrderStudy) => void;
  patientId: string;
  setPatientId: (value: string) => void;
};


export const OrderStudyImportedContext = createContext<OrderImportedContextType | null>(null)


const OrderStudyImportedProvider = ({children}) => {
  const [OrderImported, setOrderImported] = useState<Boldo.OrderStudy>({} as Boldo.OrderStudy)
  const [patientId, setPatientId] = useState<string>('')

  return(
    <OrderStudyImportedContext.Provider value={{OrderImported, setOrderImported, patientId, setPatientId}} >
      { children }
    </OrderStudyImportedContext.Provider>
  )
};


export default OrderStudyImportedProvider;