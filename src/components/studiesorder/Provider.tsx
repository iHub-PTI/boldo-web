import React, { useState, createContext}from 'react';
import { StudiesWithIndication } from './ModalTemplate/types';

export interface Orders {
    category: string,
    rush_order: boolean,
    diagnostic_impression: string
    studies?: Array<StudiesWithIndication>,
    observation: string
}

export type ContextProps = {
    orders: Array<Orders>;
    setOrders: React.Dispatch<React.SetStateAction<Orders[]>>;
    indexOrder: number;
    setIndexOrder: React.Dispatch<React.SetStateAction<number>>;
} 

export const CategoriesContext = createContext<ContextProps>({} as ContextProps )

const Provider = ({children}) => {
    const [orders, setOrders] = useState<Array<Orders>>(
        [
            {
                category: "",
                rush_order: false,
                diagnostic_impression: "",
                studies: [] as Array<StudiesWithIndication>,
                observation: ""
            }
        ]
    );
    const [indexOrder, setIndexOrder] = useState(0)

    return (
        <CategoriesContext.Provider value={{orders, setOrders, indexOrder, setIndexOrder}}>
            { children }
        </CategoriesContext.Provider>
    )
}

export default Provider;