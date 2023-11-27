import { APPROVER_DATA } from '../actionTypes';

const INITIAL_STATE= {
    data: null
} 

const  ApproverDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case APPROVER_DATA:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default ApproverDataReducer;