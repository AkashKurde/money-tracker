import { SET_DATE } from "../actionTypes";

const initialState = {
    startDate: null,
    endDate:null
  };

const FlagReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_DATE:
        return {
          ...state,
          startDate: action.payload,
          endDate:action.payload,
        };
      default:
        return state;
    }
  };

export default FlagReducer;