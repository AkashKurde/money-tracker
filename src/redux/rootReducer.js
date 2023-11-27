import { combineReducers } from 'redux';
import FlagReducer from './reducers/FlagReducer'
import ApproverDataReducer from './reducers/ApproverDataReducer';
import authReducer from './reducers/authReducer';
import ReportDataReducer from './reducers/ReportDataReducer';
import AdminStatusReducer from './reducers/AdminStatusReducer';
import AdminDataReducer from './reducers/AdminDataReducer';
import AdminProjectIDReducer from './reducers/AdminProjectIDReducer';
import UserReportDataReducer from './reducers/UserReportDataReducer';


const rootReducer = combineReducers({
    FlagReducer:FlagReducer,
    ApproverDataReducer:ApproverDataReducer,
    auth:authReducer,
    ReportDataReducer:ReportDataReducer,
    AdminStatusReducer:AdminStatusReducer,
    AdminDataReducer:AdminDataReducer,
    AdminProjectIDReducer:AdminProjectIDReducer,
    UserReportDataReducer:UserReportDataReducer
})

export default rootReducer;