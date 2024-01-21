import { UPDATE_PROFILE } from '../actionTypes';

const INITIAL_STATE= {
    data: null
} 

const  UpdateProfileReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case UPDATE_PROFILE:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default UpdateProfileReducer;