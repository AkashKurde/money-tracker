import { USER_PROFIT_DATA } from "../actionTypes";

    export const setUserProfitData = (data) => {

        return {
            type: USER_PROFIT_DATA,
            payload: data
        };

    };