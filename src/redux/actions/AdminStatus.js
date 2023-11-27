import { STATUS } from "../actionTypes";

    export const setStatus = (data) => {

        return {
            type: STATUS,
            payload: data
        };

    };