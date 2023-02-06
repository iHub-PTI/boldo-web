import React, { useState, createContext}from 'react';
import { StudiesWithIndication } from './ModalTemplate/types';

export interface Orders {
    id?: number
    category: string,
    urgent: boolean,
    diagnosis: string
    studies_codes?: Array<StudiesWithIndication>,
    notes: string,
    encounterId?:string
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
                id: 0,
                category: "",
                urgent: false,
                diagnosis: "",
                studies_codes: [] as Array<StudiesWithIndication>,
                notes: ""
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