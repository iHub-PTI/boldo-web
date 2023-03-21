import React, { useReducer } from 'react';
import axios from "axios";
import { 
  createContext, 
  ReactNode, 
  ReactElement,
  useContext, 
} from "react";
import PrescriptionReducer from './PrescriptionReducer';
import * as Sentry from '@sentry/react';


const defaultValue = Symbol('This is de default value of the prescription value');
type DefaultValue = symbol;

// this is the structure of the context
export interface PrescriptionStruct {
  prescriptions: Array<Boldo.Prescription>;
  updatePrescriptions: (id: string, payload?: Array<Boldo.Prescription>) => void;
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
    const url = `/profile/doctor/appointments/${id}/encounter`;
    try {
      if (payload) {
        dispatch({ type: 'GET_PRESCRIPTION', payload: payload });
      } else {
        const res = await axios.get(url);
        dispatch({ type: 'GET_PRESCRIPTION', payload: res.data.encounter.prescriptions });
      }
    } catch(err) {
      console.log(err);
      Sentry.setTag('appointment_id', id);
      Sentry.setTag('endpoint', url);
      if (err.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        Sentry.setTag('data', err.response.data);
        Sentry.setTag('headers', err.response.headers);
        Sentry.setTag('status_code', err.response.status);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        Sentry.setTag('request', err.request);
        console.log(err.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        Sentry.setTag('message', err.message);
        console.log('Error', err.message);
      }
      Sentry.captureException(err);
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
