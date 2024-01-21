import { SET_ALL_CHECK } from "../actionTypes";

const initialState = {
    allCheck: false
  };

const AllCheckReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_ALL_CHECK:
        return {
          ...state,
          allCheck:action.payload,
        };
      default:
        return state;
    }
  };

export default AllCheckReducer;