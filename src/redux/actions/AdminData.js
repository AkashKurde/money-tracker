import { ADMIN_DATA } from "../actionTypes";

    export const setAdminData = (data) => {

        return {
            type: ADMIN_DATA,
            payload: data
        };

    };