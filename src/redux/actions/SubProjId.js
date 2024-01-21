import { SET_SUBPROJ_ID } from "../actionTypes";

    export const setSubProjId = (data) => {

        return {
            type: SET_SUBPROJ_ID,
            payload: data
        };

    };