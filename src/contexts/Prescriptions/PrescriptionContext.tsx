import React, { useReducer } from 'react';
import axios from "axios";
import { 
  createContext, 
  ReactNode, 
  ReactElement,
  useContext, 
} from "react";
import PrescriptionReducer from './PrescriptionReducer';
import { GET_PRESCRIPTION } from '../types';


const defaultValue = Symbol('This is de default value of the prescription value');
type DefaultValue = symbol;

// this is the structure of the context
export interface PrescriptionStruct {
  prescriptions: Array<any>;
  updatePrescriptions: (id: string, payload?: Array<any>) => void;
}

const PrescriptionContext = createContext<DefaultValue | PrescriptionStruct>(defaultValue);

// definition of custom hook
export function usePrescriptionContext(): PrescriptionStruct {
  const value = useContext(PrescriptionContext);
  if (value === defaultValue) {
    throw new Error('Please, initialize the prescription context');
  }
  return value as PrescriptionStruct;
};

export function PrescriptionContextProvider({
  children
}: {
  children: ReactNode;
}): ReactElement {
  const initialState = {
    prescriptions: []
  };
  const [state, dispatch] = useReducer(PrescriptionReducer, initialState);

  const updatePrescriptions = async function (id: string, payload?: Array<any>) {
    try {
      if (payload) {
        dispatch({ type: GET_PRESCRIPTION, payload: payload });
      } else {
        const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`);
        dispatch({ type: GET_PRESCRIPTION, payload: res.data.encounter.prescriptions });
      }
    } catch(error) {
      throw new Error('Error when prescription update');
    }
  };

  return <PrescriptionContext.Provider 
  value={{
    prescriptions: state.prescriptions,
    updatePrescriptions
  }}>
    {children}
  </PrescriptionContext.Provider>;
}
