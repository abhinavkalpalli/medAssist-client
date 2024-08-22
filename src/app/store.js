import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import userSlice from '../utils/reducers/userReducer'
import doctorSlice from '../utils/reducers/doctorReducer'
import adminSlice from '../utils/reducers/adminReducer'
const persistConfig = {
  key: "root",
  storage,
  transforms: [], // Apply any transforms if needed
  stateReconciler: autoMergeLevel2,
};
const rootReducer = combineReducers({
  user: userSlice,
  doctor:doctorSlice,
  admin:adminSlice
  
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
});

export const persistor = persistStore(store);
