import { SET_DATE } from "../actionTypes";

    export const setDate = (data) => {

        return {
            type: SET_DATE,
            payload: data
        };

    };