import { GET_PRESCRIPTION } from "../types";


export default (state, action) => {
  // payload is the data
  const { payload, type } = action;

  switch (type) {
    case GET_PRESCRIPTION:
      return {
        ...state,
        prescriptions: payload,
      };
    default:
      return state;
  }
};