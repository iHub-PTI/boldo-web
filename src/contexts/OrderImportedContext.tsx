import React, { createContext, useState } from 'react';


type OrderImportedContextType = {
  OrderImported: Boldo.OrderStudy;
  setOrderImported: (value: Boldo.OrderStudy) => void;
};


export const OrderStudyImportedContext = createContext<OrderImportedContextType | null>(null)


const OrderStudyImportedProvider = ({children}) => {
  const [OrderImported, setOrderImported] = useState<Boldo.OrderStudy>({} as Boldo.OrderStudy)

  return(
    <OrderStudyImportedContext.Provider value={{OrderImported, setOrderImported}} >
      { children }
    </OrderStudyImportedContext.Provider>
  )
};


export default OrderStudyImportedProvider;