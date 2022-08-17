import React, { useState, createContext}from 'react';

export const CategoriesContext = createContext([])

const Provider = ({children}) => {
    const [orders, setOrders] = useState([
        {
            category: "",
            rush_order: false,
            diagnostic_impression: "",
            studies: [{ id: 1, name: 'Glucosa' }, { id: 2, name: ' Hemograma de Constraste' }, { id: 3, name: 'Sangre' }],
            observation: ""
        }
    ]);

    return (
        <CategoriesContext.Provider value={[orders, setOrders]}>
            { children }
        </CategoriesContext.Provider>
    )
}

export default Provider;