import { APPROVER_DATA } from "../actionTypes";

    export const setApproverData = (data) => {

        return {
            type: APPROVER_DATA,
            payload: data
        };

    };