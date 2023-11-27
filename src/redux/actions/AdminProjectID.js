import { ADMIN_PRJ_ID } from "../actionTypes";

    export const setAdminPrjoectId = (data) => {

        return {
            type: ADMIN_PRJ_ID,
            payload: data
        };

    };