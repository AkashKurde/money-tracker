import thunk from "redux-thunk";
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['FlagReducer','auth','UserReportDataReducer','ReportDataReducer','AdminStatusReducer','ApproverDataReducer','SubProjectDataReducer']
  };
  
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
  })
  
  export const persistor = persistStore(store)
  export default store;