import { ADMIN_DATA } from '../actionTypes';

const INITIAL_STATE= {
    data: null
} 

const  AdminDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case ADMIN_DATA:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default AdminDataReducer;