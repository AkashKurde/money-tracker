import { SET_ALL_CHECK } from "../actionTypes";

    export const setAllCheck = (data) => {

        return {
            type: SET_ALL_CHECK,
            payload: data
        };

    };