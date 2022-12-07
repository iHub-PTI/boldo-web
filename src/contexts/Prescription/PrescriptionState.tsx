import axios from 'axios';
import React, {useReducer} from 'react';
import { GET_PRESCRIPTION } from '../types';
import PrescriptionContext from './PrescriptionContext';
import PrescriptionReducer from './PrescriptionReducer';


const PrescriptionState = (props) => {
  const initialState = {
    prescriptions: []
  };

  const [state, dispatch] = useReducer(PrescriptionReducer, initialState);

  const getPrescriptions = async (id) => {
    try {
      const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`);
      console.log("res",res.data);
      dispatch({ type: GET_PRESCRIPTION, payload: res.data.encounter.prescriptions });
    } catch (err) {
      // TODO: add sentry
      console.log(err);
    }
  };

  return (
    <PrescriptionContext.Provider 
      value={{
        prescriptions: state.prescriptions,
        getPrescriptions
      }}
    >
      {props.children}
    </PrescriptionContext.Provider>
  );

}


export default PrescriptionState;