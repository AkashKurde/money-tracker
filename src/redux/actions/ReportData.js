import { REPORT_DATA } from "../actionTypes";

    export const setReportData = (data) => {

        return {
            type: REPORT_DATA,
            payload: data
        };

    };