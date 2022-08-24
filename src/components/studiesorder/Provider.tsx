import React, { useState, createContext}from 'react';
import { TemplateStudies } from './ModalTemplate/types';

export interface Orders {
    category: string,
    rush_order: boolean,
    diagnostic_impression: string
    studies?: Array<TemplateStudies>,
    observation: string
}

export type ContextProps = {
    orders: Array<Orders>;
    setOrders: React.Dispatch<React.SetStateAction<Orders[]>> ;
} 

const initialState:Array<Orders> = [
    {
        category: "",
        rush_order: false,
        diagnostic_impression: "",
        studies: [] as Array<TemplateStudies>,
        observation: ""
    }
]

export const CategoriesContext = createContext<ContextProps>({} as ContextProps )



const Provider = ({children}) => {
    const [orders, setOrders] = useState<Array<Orders>>(initialState);

    return (
        <CategoriesContext.Provider value={{orders, setOrders}}>
            { children }
        </CategoriesContext.Provider>
    )
}

export default Provider;