import { UPDATE_PROFILE } from "../actionTypes";

    export const setUpdateProfile = (data) => {

        return {
            type: UPDATE_PROFILE,
            payload: data
        };

    };