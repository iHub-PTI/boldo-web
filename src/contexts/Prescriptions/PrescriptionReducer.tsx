type ACTIONTYPE = { type: 'GET_PRESCRIPTION'; payload: Array<any> };

export default (state, action: ACTIONTYPE) => {

  switch (action.type) {
    case 'GET_PRESCRIPTION':
      return {
        ...state,
        prescriptions: action.payload,
      };
    default:
      return state;
  }
};