import { REPORT_DATA, USER_PROFIT_DATA } from '../actionTypes';

const INITIAL_STATE= {
    data: null 
} 

const  UserReportDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case USER_PROFIT_DATA:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default UserReportDataReducer;