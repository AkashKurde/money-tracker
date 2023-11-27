import { STATUS } from "../actionTypes";

const initialState = {
    status: null,
  };

const AdminStatusReducer = (state = initialState, action) => {
    switch (action.type) {
      case STATUS:
        return {
          ...state,
          status: action.payload,
        };
      default:
        return state;
    }
  };

export default AdminStatusReducer;