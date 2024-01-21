import { SET_SUBPROJ_ID } from "../actionTypes";

const initialState = {
    subProj:''
  };

const SubProjIdReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SUBPROJ_ID:
        return {
          ...state,
          subProj:action.payload,
        };
      default:
        return state;
    }
  };

export default SubProjIdReducer;