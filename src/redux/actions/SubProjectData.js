import { SUB_PROJECT_DATA } from "../actionTypes";

    export const setSubProjectData = (data) => {

        return {
            type: SUB_PROJECT_DATA,
            payload: data
        };

    };