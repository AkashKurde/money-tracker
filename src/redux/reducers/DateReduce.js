import { SET_DATE } from "../actionTypes";

const initialState = {
    startDate: null,
    endDate:null,
  };

const DateReduce = (state = initialState, action) => {
    switch (action.type) {
      case SET_DATE:
        return {
          ...state,
          startDate:action.payload.startDate,
          endDate:action.payload.endDate,
        };
      default:
        return state;
    }
  };

export default DateReduce;