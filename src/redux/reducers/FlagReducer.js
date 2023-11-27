import { FLAG } from "../actionTypes";

const initialState = {
    flag: false,
  };

const FlagReducer = (state = initialState, action) => {
    switch (action.type) {
      case FLAG:
        return {
          ...state,
          flag: action.payload,
        };
      default:
        return state;
    }
  };

export default FlagReducer;