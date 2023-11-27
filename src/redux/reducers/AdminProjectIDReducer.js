import { ADMIN_PRJ_ID } from "../actionTypes";

const initialState = {
    id: null,
  };

const AdminProjectIDReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADMIN_PRJ_ID:
        return {
          ...state,
          id: action.payload,
        };
      default:
        return state;
    }
  };

export default AdminProjectIDReducer;