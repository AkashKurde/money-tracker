import { REPORT_DATA } from '../actionTypes';

const INITIAL_STATE= {
    data: null 
} 

const  ReportDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case REPORT_DATA:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default ReportDataReducer;