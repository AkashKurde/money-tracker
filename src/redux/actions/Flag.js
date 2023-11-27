import { FLAG } from "../actionTypes";

    export const setflag = (data) => {

        return {
            type: FLAG,
            payload: data
        };

    };