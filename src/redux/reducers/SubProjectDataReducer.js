import { SUB_PROJECT_DATA } from '../actionTypes';

const INITIAL_STATE= {
    data: null 
} 

const  SubProjectDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case SUB_PROJECT_DATA:

           return {

             ...state, data: action.payload,

           };
         default: return state;

    }

};

export default SubProjectDataReducer;